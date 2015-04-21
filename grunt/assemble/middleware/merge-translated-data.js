var path = require('path');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');
var extendWhile = require('../utils/extend-while');

module.exports = function(assemble) {
  //var mergeTranslated = require('../utils/merge-tranlated-dictionary');
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var websiteRoot = assemble.get('data.websiteRoot');
  var locales = assemble.get('data.locales');
  var removeTranslationKeys = require('../utils/remove-translation-keys');
  var isTest = assemble.get('env') === 'test';
  var lastLocale;

  return function mergeTranslatedData (file, next) {
    var lang = assemble.get('lang');
    var subfoldersRoot = assemble.get('data.subfoldersRoot');
    var pageData = assemble.get('pageDataMap');
    var translated = assemble.get('translated');
    var dicts = assemble.get('dicts');
    var filePathData = parseFilePath(file.path);
    var locale = isTest ? 'de' : filePathData.locale;
    var dataKey = filePathData.dataKey;
    var dictKey = locales[locale];
    var mergedDict, parentKey, translatedDict, rootData;
    var layoutKeys;

    removeTranslationKeys(file.data);

    if(file.data.isPpc) {
      return next();
    }

    //extend the file with the external YML content
    if(filePathData.isRoot && !isTest && !file.data.isPpc) {
      //extend the local yml data to the page
      rootData = pageData[websiteRoot][dataKey];

      //console.log(file.path, Object.keys(rootData));
      if(rootData) {

        if(rootData.layouts) {
          layoutKeys = Object.keys(rootData.layouts);
          layoutKeys.forEach(function(key) {
            _.forEach(rootData.layouts[key], function(val, layoutKey) {
              file.data[layoutKey] = val;
            });
          });

          file.data.layouts = layoutKeys;
        }

        if(rootData.page_content) {
          file.content = rootData.page_content;
          delete rootData.page_content;
        }

        extendWhile(file.data, rootData);
      }

    } else if(filePathData.isSubfolder || ( filePathData.isRoot && isTest && !file.data.isPpc )) {
      if(isTest) {
        dataKey = dataKey.replace('/' + websiteRoot + '/', '/' + path.join(subfoldersRoot, locale) + '/');
      }
      rootData = pageData[locale][dataKey];

      if(rootData.layouts) {
        layoutKeys = Object.keys(rootData.layouts);
        layoutKeys.forEach(function(key) {
          _.forEach(rootData.layouts[key], function(val, layoutKey) {
            file.data[layoutKey] = val;
            console.log(layoutKey, val);
          });
        });

        file.data.layouts = layoutKeys;
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
      //console.log(file.data.layouts);


    } else if ( (isTest || ( file.data.locale && file.data.locale !== websiteRoot ) ) && ( filePathData.isModal || filePathData.isPartial ) ) {
      locale = file.data.locale;
      file.data.dataKey = dataKey;

      translatedDict = translated[dictKey] && translated[dictKey][dataKey];

      //TODO: for now modals/partials are not locale specific, in future may have locale specific
      //partials that possible overwrite parent partial data
      if(!file.data.isPpc && translatedDict) {
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

    next();
  };
};
