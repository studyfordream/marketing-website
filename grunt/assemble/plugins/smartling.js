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

module.exports = function (assemble) {
  var createTranslationDict = require('../utils/create-dictionary')(assemble);
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var getGlobalYml = require('./translation-utils/get-global-yml');
  var globalData = assemble.get('data');
  var globalYml = getGlobalYml(globalData);
  var env = assemble.get('env');
  var lang = assemble.get('lang') || {};
  var pageData = assemble.get('pageData');
  var pageDataClone = _.cloneDeep(pageData);
  var environment = assemble.option('environment');
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var websiteRoot = assemble.get('data.websiteRoot');
  var websiteGuts = assemble.get('data.websiteGuts');
  var locales = assemble.get('data.locales');
  var localeCodes = Object.keys(locales).map(function(subfolder) {
    return locales[subfolder];
  });
  var isTest = env === 'test';
  var runTranslations = true || isTest || env === 'smartling-staging-deploy';
  var phrases = [];

  //add the global yml keys flagged for translation to the lang object to be parsed
  //and sent to smartling
  lang.global = createTranslationDict(globalYml, 'global');

  return through.obj(function (file, enc, cb) {
    var filePathData = parseFilePath(file.path);
    var locale = filePathData.locale;
    var dataKey = filePathData.dataKey;
    var pagePhrases, trYfm, trYml, layoutData;

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

    //cache the layout data and remove it from the file.data object before translation parsing
    //because layout data will be added to pageDataClone through the plugin
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
    var sendToSmartling = require('./translation-utils/smartling-upload')(assemble);
    var populateSubfolderData = require('./translation-utils/populate-subfolder-data')(assemble);
    var translatePageData = require('./translation-utils/translate-page-data')(assemble);
    var mergeSubfolderYml = require('./translation-utils/merge-subfolder-yml')(assemble);
    var mergeLayoutData = require('./translation-utils/merge-layout-data');
    var createTranslatedObject = require('./translation-utils/create-translated-object');
    var translateGlobalYml = require('./translation-utils/translate-global-yml');

    mergeSubfolderYml(lang, pageDataClone);

    assemble.set('lang', lang);

    sendToSmartling(phrases).then(function(resolved){

      var translations = resolved[0];
      //this will become the dictionary for pages
      var translated = {};

      /**
       * iterate through locales to create complete the `pageDataClone` object
       *
       * pageDataClone = {
       *  website: {
       *    fp: 'val'
       *  },
       *  de: {
       *    fp: 'val'
       *  },
       *  modals: {
       *    fp: 'val'
       *  }
       * }
       */
      Object.keys(locales).forEach(function(locale) {
        var dictKey = locales[locale];

        try {
          populateSubfolderData(locale, pageDataClone);
        } catch(e) {
          console.error('ERROR: populateSubfolderData', e);
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
          console.error('ERROR: translatePageData', e);
        }

      });

      //remove translation keys after page translations
      removeTranslationKeys(pageDataClone);

      try {
        mergeLayoutData(pageDataClone);
      } catch(e) {
        console.error('ERROR: mergeLayoutData', e);
      }

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
      try {
        Object.keys(locales).forEach(function(locale) {
          var localeCode = locales[locale];

          //create the translated object making sure to account for multiple domains potentially
          //associated with the same translation key
          translated[localeCode] = createTranslatedObject(locales, localeCode, pageDataClone);

          //translate the global yml and attach it to the translated object to be swapped out in the middleware
          translated[localeCode].global = {};
          translated[localeCode].global = translateGlobalYml(localeCode, globalYml, translations);
        });

        removeTranslationKeys(globalData);
      } catch(e) {
        console.error('ERROR: createTranslatedObject', e);
      }

      assemble.set('rootData', pageDataClone[websiteRoot]);
      assemble.set('translated', translated);

      cb();
    });
  });

};
