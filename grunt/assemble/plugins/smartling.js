'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var extend = require('extend-shallow');
var through = require('through2');
var removeTranslationKeys = require('../utils/remove-translation-keys');
var extendWhile = require('../utils/extend-while');
var generateKey = require('../utils/generate-key');
var hbsParser = require('l10n-tools/hbs-parser');
var objParser = require('l10n-tools/object-extractor');
var Q = require('q');

module.exports = function (assemble) {
  var globalData = assemble.get('data');
  var sendToSmartling = require('./translation-utils/smartling-upload')(assemble);
  var lang = assemble.get('lang') || {};
  var pageData = assemble.get('pageData');
  var environment = assemble.option('environment');
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var websiteRoot = assemble.get('data.websiteRoot');
  var websiteGuts = assemble.get('data.websiteGuts');
  var clonePageData = require('./translation-utils/add-yfm-data');
  var locales = assemble.get('data.locales');
  var localeCodes = Object.keys(locales).map(function(subfolder) {
    return locales[subfolder];
  });
  var createTranslationDict = require('../utils/create-dictionary')(assemble);
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var env = assemble.get('env');
  var isTest = env === 'test';
  var runTranslations = true || isTest || env === 'smartling-staging-deploy';
  var getLayoutData = require('./translation-utils/add-layout-data');
  var phrases = [];
  var pageDataMap = {};
  var pageDataClone = _.cloneDeep(pageData);
  var getGlobalYml = require('./translation-utils/get-global-yml');
  var globalYml = getGlobalYml(globalData);

  //add the global yml keys flagged for translation to the lang object to be parsed
  //and sent to smartling
  lang.global = createTranslationDict(globalYml, 'global');

  return through.obj(function (file, enc, cb) {
    var ppcRe = new RegExp(path.join(websiteRoot, 'om'));
    var filePathData = parseFilePath(file.path);
    var locale = filePathData.locale;
    var dataKey = filePathData.dataKey;
    var pagePhrases, trYfm, trYml;
    var layoutData;
    pageDataClone[locale] = pageDataClone[locale] || {};
    pageDataClone[locale][dataKey] = pageDataClone[locale][dataKey] || {};
    lang[locale] = lang[locale] || {};
    lang[locale][dataKey] = lang[locale][dataKey] || {};

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

    if(file.data.layouts) {
      layoutData = file.data.layouts;
      delete file.data.layouts;
    }

    //get TR|MD prefixed keys and swap out MD content for HTML content
    trYfm = createTranslationDict(file, locale);

    //add all the parsed YFM to the page data object
    _.merge(pageDataClone[locale][dataKey], trYfm);

    trYml = createTranslationDict(pageDataClone[locale][dataKey], locale);

    //extend the lang object with data from the YFM of file.data
    //and external yml data
    if(Object.keys(trYml)) {
      lang[locale][dataKey] = trYml;
    }

    if(layoutData) {
      pageDataClone[locale][dataKey].layouts = layoutData;
    }

    this.push(file);
    cb();
  }, function (cb) {
    var populateSubfolderData = require('./translation-utils/populate-subfolder-data')(assemble);
    var translatePageData = require('./translation-utils/translate-page-data')(assemble);
    var mergeSubfolderYml = require('./translation-utils/merge-subfolder-yml')(assemble);

    mergeSubfolderYml(lang, pageDataClone);

    assemble.set('lang', lang);

    sendToSmartling(phrases).then(function(resolved){

      var translations = resolved[0];
      //this will become the dictionary for pages
      var translated = {};

      try{
        /**
         * iterate through locales to create a `translated` object
         *
         * translated = {
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

          try {
            populateSubfolderData(locale, pageDataClone);
          } catch(e) {
            this.emit('ERROR: populateSubfolderData', e);
          }

          var specialTypes = [
            'modals',
            'layouts',
            'partials'
          ];

          /**
           * Utility Function for iterating through the special types in the lang object ['modals', 'layouts', 'partials']
           * and merging their filepath/values into the pageDataClone locale object
           */
          specialTypes.forEach(function(type) {
            _.merge(pageDataClone[locale], lang[type] || {});
          });


          try {
            translatePageData(locale, dictKey, lang, pageDataClone, translations);
          } catch(e) {
            console.log('ERROR: translatePageData', e);
          }

        });

        //remove translation keys after page translations
        removeTranslationKeys(pageDataClone);

        _.forEach(pageDataClone, function(filePaths, type) {

          _.forEach(filePaths, function(data, fp) {
            var layoutKeys = Object.keys(data.layouts || {});
            var layoutData;

            if(layoutKeys.length) {
              layoutData = layoutKeys.reduce(function(o, key) {
                _.merge(o, data.layouts[key]);
                return o;
              }, {});

              _.merge(data, layoutData);
              data.layouts = layoutKeys;
            }
          });

        });

        /**
         * Create a dictionary object for all pages
         *
         */
        try {
          _.forEach(locales, function(localeCode, locale) {
            var filteredLocales = Object.keys(pageDataClone).filter(function(pageDataKey) {
              if(locales[pageDataKey] === localeCode) {
                return true;
              }
            });

            translated[localeCode] = filteredLocales.reduce(function(o, pageDataKey) {
              _.forEach(pageDataClone[pageDataKey], function(val, fp) {
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
              var clone = _.cloneDeep(val);

              localeDict.global[basenameKey] = objParser.translate(clone, translations[localeCode][fp]);
              removeTranslationKeys(localeDict.global[basenameKey]);
            });

          });

        } catch(e) {
          console.log('ERROR 7', e);
        }


        removeTranslationKeys(globalData);
        console.log(globalData);

      } catch(err) {
        this.emit('ERROR 8', err);
      }

      assemble.set('pageDataMap', pageDataClone);
      assemble.set('translated', translated);

      cb();
    });
  });

};
