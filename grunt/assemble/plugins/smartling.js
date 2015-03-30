'use strict';

var path = require('path');
var globby = require('globby');
var fs = require('fs');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var through = require('through2');
var extend = require('extend-shallow');
var htmlParser = require('l10n-tools/html-parser');
var smartling = require('l10n-tools/smartling');
var objParser = require('l10n-tools/object-extractor');
var removeTranslationKeys = require('../utils/plugin-remove-translation-keys');
var fs = require('fs');
var q = require('q');
var glob = require('glob');
var crypto = require('crypto');
var extendWhile = require('../utils/extend-while');
var smartlingConfig;

try{
  smartlingConfig = fs.readFileSync(path.join(process.cwd(), 'configs/smartlingConfig.json'), {encoding: 'utf8'});
} catch(err){
  console.error('Cannot read Smartling config: ', err);
}
if(smartlingConfig){
  smartlingConfig = JSON.parse(smartlingConfig);
}

var jsParser = require('l10n-tools/js-parser');
var hbsParser = require('l10n-tools/hbs-parser');
var smartling = require('l10n-tools/smartling');
var Q = require('q');
var fs = require('fs');

try{
  var smartlingConfig = fs.readFileSync('./configs/smartlingConfig.json', {encoding: 'utf-8'});
} catch(err){
  console.error('Cannot read Smartling config: ', err);
}
if(smartlingConfig){
  smartlingConfig = JSON.parse(smartlingConfig);
}



module.exports = function (assemble) {
  //var extendFileData = require('../utils/plugin-extend-file-data')(assemble);
  var lang = assemble.get('lang') || {};
  var pageData = assemble.get('pageData');
  var environment = assemble.option('environment');
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var websiteRoot = assemble.get('data.websiteRoot');
  var websiteGuts = assemble.get('data.websiteGuts');
  var locales = assemble.get('data.locales');
  var localeCodes = Object.keys(locales).map(function(subfolder) {
    return locales[subfolder];
  });
  var createTranslationDict = require('../utils/create-dictionary')(assemble);
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var generateKey = require('../utils/generate-key');
  var env = assemble.get('env');
  var runTranslations =  env === 'test' || env === 'smartling-staging-deploy';
  var phrases = [];
  var ignoreKeys = [
    'src',
    'dest',
    'layout'
  ];
  var yfmSpecificData = {};

  var checksumChanged = function checksumChanged(content, fname){
    if(env === 'test' && glob.sync('tmp/download/*.pot').length) {
      return true;
    } else {
      var hash = crypto.createHash('md5');
      hash.setEncoding('hex');
      hash.write(content);
      hash.end();
      var newSum = hash.read();

      var latestSum = null;
      if(fs.existsSync(fname))
      {
        // now compare with latest uploaded catalogue checksum
        hash = crypto.createHash('md5');
        hash.setEncoding('hex');
        hash.write(fs.readFileSync(fname, {encoding: 'UTF8'}));
        hash.end();
        latestSum = hash.read();
      }
      return newSum === latestSum;
    }
  };

  var subfolderTemplates = [];
  return through.obj(function (file, enc, cb) {
    var ppcRe = new RegExp(path.join(websiteRoot, 'om'));
    var filePathData = parseFilePath(file.path);
    var locale = filePathData.locale;
    var dataKey = filePathData.dataKey;
    //create lang dictionary from TR prefixes
    var parsedTranslations = createTranslationDict(file, locale);
    var pagePhrases;

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

    if(Object.keys(parsedTranslations).length > 0) {
      lang[locale] = lang[locale] || {};
      yfmSpecificData[locale] = yfmSpecificData[locale] || {};
      yfmSpecificData[locale][dataKey] = yfmSpecificData[locale][dataKey] || {};
      yfmSpecificData[locale][dataKey] = Object.keys(file.data).reduce(function(o, key) {
        if(ignoreKeys.indexOf(key) === -1) {
          o[key] = file.data[key];
        }
        return o;
      }, {});
      lang[locale][dataKey] = extend({}, lang[locale][dataKey], parsedTranslations);
    }

    this.push(file);
    cb();
  }, function (cb) {
    var subfolderFiles = globby.sync('**/*.{hbs,yml}', {cwd: subfoldersRoot});
    var subfolderO = subfolderFiles.reduce(function(o, fp) {
      var key = '/' + path.join(subfoldersRoot, path.dirname(fp), 'index');
      if(!o[key]) {
        o[key] = [];
      }
      o[key].push(path.extname(fp).replace('.', ''));

      return o;
    }, {});

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

    lang.global = createTranslationDict(globalYml, 'global');
    assemble.set('lang', lang);

    if(runTranslations) {
      var DICT_FNAME = 'marketing_website_yaml.pot';
      var JS_DICT_FNAME = 'marketing_website_js.pot';

      _.forEach(lang, function(pages){
        _.forEach(pages, function(fileInfo, fname){
          var list = objParser.extract(fileInfo);
          phrases.push({fname: fname, phrases: list});
        });
      });

      var extractFrom = function extractFrom(srcs, parser){
        return glob.sync(srcs).map(function (fname) {
          var phrases = parser.extract(fs.readFileSync(fname));
          return {
            fname: generateKey(fname),
            phrases: phrases
          };
        });
      };

      var createDirs = [
        'tmp/upload',
        'tmp/download',
        'dist/assets/js'
      ];

      createDirs.forEach(function(dir) {
        if(!fs.existsSync(dir)) {
          mkdirp.sync(dir);
        }
      });

      var clientHbsPhrases = extractFrom(path.join(websiteGuts, 'templates/client/**/*.hbs'), hbsParser);
      phrases = phrases.concat(clientHbsPhrases);
      var content = smartling.generatePO(phrases);
      var yamlDefer = Q.defer();
      if(checksumChanged(content, 'tmp/upload/' + DICT_FNAME)){
        console.log('Master catalog didn\'t update since last upload - using cached dictionaries.');
        var translations = {};
        localeCodes.map(function(code){
          var body = fs.readFileSync('tmp/download/' + code + '-' + DICT_FNAME, {encoding: 'UTF8'});
          translations[code] = smartling.parsePOWithContext(body);
        });
        assemble.set('dicts', translations);
        yamlDefer.resolve();
      } else {
        fs.writeFile('tmp/upload/' + DICT_FNAME, content);
        smartling.send(content, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID, DICT_FNAME).then(function(){
          var translations = {};
          var defers = localeCodes.map(function(code){
            return smartling.fetch(smartlingConfig.URL, code, DICT_FNAME, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID).then(function(body){
              fs.writeFile('tmp/download/' + code + '-' + DICT_FNAME, body);
              translations[code] = smartling.parsePOWithContext(body);
            });
          });

          // when all translations are fetched - call callback
          q.all(defers).then(function(){
            assemble.set('dicts', translations);
            yamlDefer.resolve();
          });
        });
      }

      var jsPhrases = extractFrom('website-guts/assets/js/**/*.js', jsParser);
      content = smartling.generatePO(jsPhrases);
      var jsDefer = Q.defer();

      var deployJSDict = function deployJSDict(locale, body) {
        var dict = smartling.parsePO2dict(body);
        content = 'window.optlyDict = ' + JSON.stringify(dict);
        var outputFname = './dist/assets/js/dict.' + locale + '.js';
        fs.writeFileSync(outputFname, content);
      };

      if(checksumChanged(content, 'tmp/upload/' + JS_DICT_FNAME)){
        console.log('Master catalog didn\'t since last upload - using cached dictionaries for JS.');
        localeCodes.map(function(code){
          var body = fs.readFileSync('tmp/download/' + code + '-' + JS_DICT_FNAME, {encoding: 'UTF8'});
          deployJSDict(code, body);
        });
        jsDefer.resolve();
      } else {
        fs.writeFile('tmp/upload/' + JS_DICT_FNAME, content);
        smartling.send(content, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID, JS_DICT_FNAME).then(function(){
          var defers = localeCodes.map(function(code){
            return smartling.fetch(smartlingConfig.URL, code, JS_DICT_FNAME, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID).then(function(body){
              fs.writeFile('tmp/download/' + code + '-' + JS_DICT_FNAME, body);
              deployJSDict(code, body);
            });
          });

          // when all translations are fetched - call callback
          Q.all(defers).then(function(){
            jsDefer.resolve();
          });
        });
      }

      Q.all([yamlDefer.promise, jsDefer.promise]).then(function(){
        //lang has `global` object
        var translated = {};

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
            _.forEach(pageData[locale], function(content, fp) {
              var subfolderFiles = subfolderO[fp];
              var parentKey = '/' + path.join(websiteRoot, fp.split('/' + locale + '/')[1]);


              if(subfolderFiles.length > 1 && subfolderFiles.indexOf('hbs') !== -1) {
                //subfolder directory has it's own template and is not inherited
                _.forEach(lang[locale][fp], function(val, key) {
                  if(key !== 'page_data') {
                    val = _.clone(val);
                    pageData[locale][fp][key] = val;
                  }
                });
              } else {
                //check if YML with no template exists in subfolders and extend from
                //website root data appropriately
                _.forEach(lang[websiteRoot][parentKey], function(val, key) {
                  if(key !== 'page_data') {
                    val = _.clone(val);
                    pageData[locale][fp][key] = val;
                  }
                });

                if(subfolderFiles.length === 1 && subfolderFiles[0] === 'yml') {
                  pageData[locale][fp] = _.merge({}, pageData[websiteRoot][parentKey], pageData[locale][fp]);
                }

                //translate here because it is difficult to reconcile later
                objParser.translate(pageData[locale][fp], translations[dictKey][parentKey]);
              }
            });
            } catch(e) {
              console.log(e, locale);
            }

            //put in website data flagged for translation if template is not present in subfolder
            _.forEach(lang[websiteRoot], function(val, fp) {
              var subfolderPath = fp.replace('/' + websiteRoot + '/', '/' + path.join(subfoldersRoot, locale) + '/');
              if(!pageData[locale][subfolderPath]) {
                val = _.clone(val);
                //have to merge here or lose values not flagged for translation
                pageData[locale][subfolderPath] = _.merge({}, pageData[websiteRoot][fp] || {}, val);
              }
            });

            ['modals', 'layouts', 'partials'].forEach(function(type) {
              _.merge(pageData[locale], lang[type] || {});
            });

            _.forEach(pageData[locale], function(val, fp) {
              var parentPath = fp.replace(path.join(subfoldersRoot, locale), websiteRoot);

              if(translations[dictKey][fp]) {
                objParser.translate(pageData[locale][fp], translations[dictKey][fp]);
              } else if(translations[dictKey][parentPath]) {
                objParser.translate(pageData[locale][fp], translations[dictKey][parentPath]);
              }
            });

            ['modals', 'layouts', 'partials'].forEach(function(type) {
              _.forEach(yfmSpecificData[type], function(val, fp) {
                var data = pageData[locale][fp];
                if(data) {
                  pageData[locale][fp] = _.merge({}, val, data);
                }
              });
            });

          });

          removeTranslationKeys(pageData);

          //add the page content to page data after parsing
          _.forEach(lang[websiteRoot], function(val, fp) {
            if(val.HTML_page_content) {
              if(!pageData[websiteRoot][fp]) {
                pageData[websiteRoot][fp] = {};
              }
              pageData[websiteRoot][fp].page_content = val.HTML_page_content;
            }
          });


          /**
           * Create a dictionary object for all pages
           *
           */
          _.forEach(locales, function(localeCode, locale) {
            var filteredLocales = Object.keys(pageData).filter(function(pageDataKey) {
              if(locales[pageDataKey] === localeCode) {
                return true;
              }
            });

            translated[localeCode] = filteredLocales.reduce(function(o, pageDataKey) {
              _.forEach(pageData[pageDataKey], function(val, fp) {
                if(!o.hasOwnProperty(fp)) {
                  o[fp] = val;
                }
              });

              return o;
            }, {});
          });

          _.forEach(translated, function(localeDict, localeCode) {
            localeDict.global = localeDict.global || {};

            _.forEach(globalYml, function(val, fp) {
              var basenameKey = path.basename(fp, path.extname(fp));

              localeDict.global[basenameKey] = objParser.translate(val, translations[localeCode][fp]);
              removeTranslationKeys(localeDict.global[basenameKey]);
            });

          });

          removeTranslationKeys(globalData);

        } catch(err) {
          this.emit('error', err);
        }

        assemble.set('pageData', pageData[websiteRoot]);
        assemble.set('translated', translated);
        assemble.set('data', globalData);

        cb();
      });
    } else {
      //add the page content to page data after parsing
      _.forEach(lang[websiteRoot], function(val, fp) {
        if(val.HTML_page_content) {
          if(!pageData[websiteRoot][fp]) {
            pageData[websiteRoot][fp] = {};
          }
          pageData[websiteRoot][fp].page_content = val.HTML_page_content;
        }
      });

      removeTranslationKeys(pageData);
      removeTranslationKeys(globalData);
      assemble.set('dicts', {});
      assemble.set('pageData', pageData[websiteRoot]);
      cb();
    }
  });

};
