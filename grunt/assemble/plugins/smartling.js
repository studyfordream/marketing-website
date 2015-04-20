'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var extend = require('extend-shallow');
var globby = require('globby');
var through = require('through2');
var removeTranslationKeys = require('../utils/remove-translation-keys');
var extendWhile = require('../utils/extend-while');
var generateKey = require('../utils/generate-key');
var hbsParser = require('l10n-tools/hbs-parser');
var objParser = require('l10n-tools/object-extractor');
var Q = require('q');

module.exports = function (assemble) {
  var sendToSmartling = require('./translation-utils/smartling-upload')(assemble);
  var addLayoutData = require('./translation-utils/add-layout-data');
  var lang = assemble.get('lang') || {};
  var pageData = assemble.get('pageData');
  var environment = assemble.option('environment');
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var websiteRoot = assemble.get('data.websiteRoot');
  var websiteGuts = assemble.get('data.websiteGuts');
  var clonePageData = require('./translation-utils/clone-page-data');
  var locales = assemble.get('data.locales');
  var localeCodes = Object.keys(locales).map(function(subfolder) {
    return locales[subfolder];
  });
  var createTranslationDict = require('../utils/create-dictionary')(assemble);
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var env = assemble.get('env');
  var isTest = env === 'test';
  var runTranslations = true || isTest || env === 'smartling-staging-deploy';
  var phrases = [];
  var pageDataMap = {};
  var layoutData = {};

  return through.obj(function (file, enc, cb) {
    var ppcRe = new RegExp(path.join(websiteRoot, 'om'));
    var filePathData = parseFilePath(file.path);
    var locale = filePathData.locale;
    var dataKey = filePathData.dataKey;
    var seoTitle = file.data.TR_seo_title;
    var seoTitleSuffix = ' - Optimizely';
    var pagePhrases, parsedTranslations;
    layoutData[locale] = layoutData[locale] || {};

    if(seoTitle && !~seoTitle.indexOf(seoTitleSuffix) && !~seoTitle.indexOf('Optimizely:')) {
      file.data.TR_seo_title = seoTitle.trim() + seoTitleSuffix;
    }

    //parse file contents for tr helper phrases
    if(file.contents) {
      pagePhrases = hbsParser.extract(file.contents.toString());
      if(pagePhrases.length) {
        phrases.push({
          fname: dataKey,
          phrases: pagePhrases
        });
      }
    }

    //add the layout data onto the file object
    //important to do this before clonePageData because layout data must be added to the file object
    addLayoutData(file, filePathData, isTest);

    //create a clone of the page data to later create the translation dictionary
    clonePageData(file, filePathData, pageDataMap, pageData);

    //create lang dictionary from TR prefixes
    parsedTranslations = createTranslationDict(file, locale);

    //extend the lang object with data from the YFM of file.data
    //before this lang only contains external YML parsed from the transform
    if(Object.keys(parsedTranslations).length > 0) {
      lang[locale] = lang[locale] || {};
      lang[locale][dataKey] = _.merge({}, lang[locale][dataKey], parsedTranslations);
    }

    this.push(file);
    cb();
  }, function (cb) {
    //merge the external YML
    //_.forEach(pageData[websiteRoot], function(val, fp) {
      //pageDataMap[websiteRoot][fp] = _.merge({}, pageDataMap[websiteRoot][fp], val);
    //});

    //add the layout data
    //_.forEach(layoutData[websiteRoot], function(layoutObj, fp) {

      //_.forEach(layoutObj, function(val, layoutPath) {
        //var data = pageDataMap[websiteRoot][fp];
        ////account for missing pages with no previous data
        //if(data) {
          //_.merge(pageDataMap[websiteRoot][fp], val);
        //} else {
          //pageDataMap[websiteRoot][fp] = val;
        //}
      //});

      ////delete pagedatamap[websiteroot][fp].layouts;
    //});

    /**
     *
     * Create an object of global yaml data and delete keys from globalData
     * that reference file paths rather than file names
     * this inentionally mutates the assemble.cache.data object as it is not immutable
     *
     * globalYml = {
     *   fpBasenameNoExt: ymlDataObj
     * }
     *
     */
    var globalData = assemble.get('data');
    var globalYml = Object.keys(globalData).reduce(function(o, key) {
      if(/global\_/.test(key)) {
        var basenameKey = path.basename(key, path.extname(key));
        o[key] = globalData[key];
        globalData[basenameKey] = globalData[key];
        //intentionally mutate the assemble.cached.data object
        delete globalData[key];
      }
      return o;
    }, {});

    //add the global yml keys flagged for translation to the lang object to be parsed
    //and sent to smartling
    lang.global = createTranslationDict(globalYml, 'global');
    assemble.set('lang', lang);

    if(runTranslations) {
      var yamlDefer = Q.defer();
      var jsDefer = Q.defer();

      sendToSmartling(yamlDefer, jsDefer, phrases);

      Q.all([yamlDefer.promise, jsDefer.promise]).then(function(resolved){

        var translations = resolved[0];
        //this will become the dictionary for pages
        var translated = {};

        /**
         *
         * Read subfolders directory to determin if template exists
         * subfolderO = {
         *   fp: ['yml', 'hbs],
         *   fp: ['yml']
         * }
         *
         */
        var subfolderFiles = globby.sync('**/*.{hbs,yml}', {cwd: subfoldersRoot});
        var subfolderO = subfolderFiles.reduce(function(o, fp) {
          var key = '/' + path.join(subfoldersRoot, path.dirname(fp), 'index');
          if(!o[key]) {
            o[key] = [];
          }
          o[key].push(path.extname(fp).replace('.', ''));

          return o;
        }, {});

        //add the page content to page data after parsing
        _.forEach(lang[websiteRoot], function(val, fp) {
          _.merge(pageDataMap[websiteRoot][fp], _.clone(val));
        });

        try{

          //iterate through locales to create a `translated` object
          /**
           * tranlated = {
           *  de_DE: {
           *    fp: 'val'
           *  },
           *  fr_FR: {
           *    fp: 'val'
           *  }
           * }
           */
          Object.keys(locales).forEach(function(locale) {
            var dictKey = locales[locale];

            try{
              /**
               * Function that merges external yml and attaches it to the page data object. If a subfolder
               * has external yml but not it's own template it must be translated on the fly from two different
               * dictionary entries.
               *
               * case 1: locale template exists
               * case 2: only external yml exists, must inherit external yml from parent and tranlsate on the fly
               *
               */
              Object.keys(lang[locale]).forEach(function(fp) {
                var subfolderFiles = subfolderO[fp];
                var parentKey = fp.replace(path.join(subfoldersRoot, locale), websiteRoot);
                var data;

                if(subfolderFiles.length === 1 && subfolderFiles[0] === 'yml') {
                  data = _.merge({}, lang[websiteRoot][parentKey], lang[locale][fp]);
                  //translate here because it is difficult to reconcile later
                  //objParser.translate(data, translations[dictKey][fp]);
                  objParser.translate(data, translations[dictKey][parentKey]);
                  pageDataMap[locale][fp] = _.merge({}, pageData[websiteRoot][parentKey], pageData[locale][fp], data);
                } else {
                  data = _.clone(lang[locale][fp]);
                  //objParser.translate(data, translations[dictKey][fp]);
                  pageDataMap[locale][fp] = _.merge({}, pageData[locale][fp], data);
                }

              });

            } catch(e) {
              console.log('ERROR 1', e, locale);
            }

            try {
              /**
               * Function for populating the page data object with filepath related objects inherited from the parent website
               * if they do not have their own templates or yml files in subfolders.
               *
               */
              _.forEach(pageDataMap[websiteRoot], function(val, fp) {
                var subfolderPath = fp.replace('/' + websiteRoot + '/', '/' + path.join(subfoldersRoot, locale) + '/');
                if(!pageDataMap[locale][subfolderPath]) {
                  val = _.clone(val);
                  //have to merge here or lose values not flagged for translation
                  pageDataMap[locale][subfolderPath] = _.merge({}, pageData[websiteRoot][fp] || {}, val);
                }
              });

            } catch(e) {
              console.log('ERROR 2', e);
            }
            try{
              /**
               * Function that merges layout data and translates
               * must account for pages that are inherited
               *
               */
            //add the layout data
            _.forEach(pageDataMap[locale], function(pageDataObj, fp) {
              var parentKey = fp.replace(path.join(subfoldersRoot, locale), websiteRoot);
              var layoutObj, fpDictKey;

              if(layoutData[locale][fp]) {
                layoutObj = layoutData[locale][fp];
                fpDictKey = fp;
              } else {
                layoutObj = layoutData[websiteRoot][parentKey];
                fpDictKey = parentKey;
              }
              //console.log(fpDictKey);

              _.forEach(layoutObj, function(val, layoutPath) {
                var clone = _.clone(val);
                if(_.isPlainObject(pageDataMap[locale][fp].layouts) || !pageDataMap[locale][fp].layouts) {
                  pageDataMap[locale][fp].layouts = [];
                }
                pageDataMap[locale][fp].layouts.push(layoutPath);
                //must translate here because need the layout key path
                objParser.translate(clone, translations[dictKey][layoutPath]);
                _.merge(pageDataMap[locale][fp], clone);
              });

              //delete pageDataMap[websiteRoot][fp].layouts;
            });


            } catch(e) {
              console.log('LAYOUT DATA MERGE ERROR', e, locale);
            }


            var specialTypes = [
              'modals',
              'layouts',
              'partials'
            ];

            /**
             * Utility Function for iterating through the special types in the lang object ['modals', 'layouts', 'partials']
             * and merging their filepath/values into teh pageData locale object
             */
            specialTypes.forEach(function(type) {
              _.merge(pageDataMap[locale], lang[type] || {});
            });


            /**
             * Function for iterating the completed pageData object and performing translations appropriately
             *
             * case 1: locale specific file is in the dictionary so use it
             * case 2: file is inherited from the root website so must use a parent key in the dictionary to translate
             */
            try {

              _.forEach(pageDataMap[locale], function(val, fp) {
                var parentPath = fp.replace(path.join(subfoldersRoot, locale), websiteRoot);

                if(translations[dictKey][fp]) {
                  objParser.translate(pageDataMap[locale][fp], translations[dictKey][fp]);
                } else if(translations[dictKey][parentPath]) {
                  objParser.translate(pageDataMap[locale][fp], translations[dictKey][parentPath]);
                }
              });

            } catch(e) {
              console.log('ERROR 3', e);
            }

          });

          removeTranslationKeys(pageDataMap);

          try {
            //add the page content to page data after parsing
            _.forEach(lang[websiteRoot], function(val, fp) {
              if(val.HTML_page_content) {
                if(!pageDataMap[websiteRoot][fp]) {
                  pageDataMap[websiteRoot][fp] = {};
                }
                pageDataMap[websiteRoot][fp].page_content = val.HTML_page_content;
              }
            });

          } catch(e) {
            console.log('ERROR 5', e);
          }

          /**
           * Create a dictionary object for all pages
           *
           */
          try {
            _.forEach(locales, function(localeCode, locale) {
              var filteredLocales = Object.keys(pageDataMap).filter(function(pageDataKey) {
                if(locales[pageDataKey] === localeCode) {
                  return true;
                }
              });

              translated[localeCode] = filteredLocales.reduce(function(o, pageDataKey) {
                _.forEach(pageDataMap[pageDataKey], function(val, fp) {
                  if(!o.hasOwnProperty(fp)) {
                    o[fp] = val;
                  }
                });

                return o;
              }, {});
            });

          } catch(e) {
            console.log('ERROR 6', e);
          }


          try {
            _.forEach(translated, function(localeDict, localeCode) {
              localeDict.global = localeDict.global || {};

              _.forEach(globalYml, function(val, fp) {
                var basenameKey = path.basename(fp, path.extname(fp));

                localeDict.global[basenameKey] = objParser.translate(val, translations[localeCode][fp]);
                removeTranslationKeys(localeDict.global[basenameKey]);
              });

            });

          } catch(e) {
            console.log('ERROR 7', e);
          }


          removeTranslationKeys(globalData);

        } catch(err) {
          this.emit('ERROR 8', err);
        }
        //console.log(pageDataMap);

        assemble.set('rootData', pageDataMap[websiteRoot]);
        assemble.set('translated', translated);
        console.log(Object.keys(translated));
        //assemble.set('data', globalData);

        cb();
      });
    } else {
      //add the page content to page data after parsing
      _.forEach(lang[websiteRoot], function(val, fp) {
        if(val.HTML_page_content) {
          if(!pageDataMap[websiteRoot][fp]) {
            pageDataMap[websiteRoot][fp] = {};
          }
          pageDataMap[websiteRoot][fp].page_content = val.HTML_page_content;
        }
      });

      removeTranslationKeys(pageDataMap);
      removeTranslationKeys(globalData);
      assemble.set('translated', {});
      assemble.set('rootData', pageDataMap[websiteRoot]);
      cb();
    }
  });

};
