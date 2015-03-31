var path = require('path');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');
var extendWhile = require('../utils/extend-while');

module.exports = function(assemble) {
  //var mergeTranslated = require('../utils/merge-tranlated-dictionary');
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var extendFileData = require('../utils/extend-file-data')(assemble);
  var mergeLayoutContext = require('../utils/merge-layout-context')(assemble);
  var websiteRoot = assemble.get('data.websiteRoot');
  var locales = assemble.get('data.locales');
  var removeTranslationKeys = require('../utils/remove-translation-keys');
  var isTest = assemble.get('env') === 'test';
  var lastLocale;

  return function mergeTranslatedData (file, next) {
    var lang = assemble.get('lang');
    var subfoldersRoot = assemble.get('data.subfoldersRoot');
    var pageData = assemble.get('pageData');
    var translated = assemble.get('translated');
    var dicts = assemble.get('dicts');
    var filePathData = parseFilePath(file.path);
    var locale = isTest ? 'de' : filePathData.locale;
    var dataKey = filePathData.dataKey;
    var dictKey = locales[locale];
    var mergedDict, parentKey, translatedDict, rootData;

    if(file.data.isPpc) {
      return next();
    }

    removeTranslationKeys(file.data);

    mergeLayoutContext(file);
    //extend the file with the external YML content
    //extendFileData(filePathData, file);

    if(filePathData.isRoot && !isTest && !file.data.isPpc) {
      //extend the local yml data to the page
      rootData = pageData[dataKey];

      if(rootData) {

        if(rootData.page_content) {
          file.content = rootData.page_content;
          delete rootData.page_content;
        }

        extendWhile(file.data, rootData);
      }
    }

    else if(filePathData.isSubfolder || ( filePathData.isRoot && isTest && !file.data.isPpc )) {
      if(isTest) {
        dataKey = dataKey.replace('/' + websiteRoot + '/', '/' + path.join(subfoldersRoot, locale) + '/');
      }
      //set the locale on the page context for modal|partial translation
      file.data.locale = locale;
      file.data.dataKey = dataKey;
      translatedDict = translated[dictKey] && translated[dictKey][dataKey];

      if(translatedDict) {

        if(translatedDict.page_content) {
          file.content = translatedDict.page_content;
          delete translatedDict.page_content;
        }

        extendWhile(file.data, translatedDict);
      }


    } else if ( /*locale !== websiteRoot || isTest*/  (filePathData.isModal || filePathData.isPartial) ) {
      locale = file.data.locale;
      file.data.dataKey = dataKey;

      translatedDict = translated[dictKey] && translated[dictKey][dataKey];

      //TODO: for now modals/partials are not locale specific, in future may have locale specific
      //partials that possible overwrite parent partial data
      if(translatedDict) {
        extendWhile(file.data, translatedDict);
      }
    }
    //deal with global data
    //this assumes that modals and partials don't access global data
    if(locale !== lastLocale && !file.data.isPpc && !filePathData.isModal && !filePathData.isPartial) {
      var globalData = assemble.get('data');

      if(isTest || filePathData.isSubfolder) {
        Object.keys(globalData).forEach(function(key) {
          if(/global\_/.test(key)) {
            //intentionally mutate assemble.cache.data
            globalData[key] = translated[dictKey].global[key];
          }
        });
      }

      lastLocale = locale;
    }

    //remove all the TR|MD|HTML prefixes
    removeTranslationKeys(file);
    next();
  };
};
