var extendWhile = require('../utils/extend-while');

module.exports = function(assemble) {
  var websiteRoot = assemble.get('data.websiteRoot');
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var locales = assemble.get('data.locales');
  var removeTranslationKeys = require('../utils/remove-translation-keys');
  var lastLocale;

  return function mergeTranslatedData (file, next) {
    var rootData = assemble.get('rootData');
    var translated = assemble.get('translated');
    var filePathData = parseFilePath(file.path);
    var locale = filePathData.locale;
    var dataKey = filePathData.dataKey;
    var dictKey = locales[locale];
    var data;

    removeTranslationKeys(file.data);

    if(!file.data.isPpc) {

      //extend the file with the external YML content
      if(filePathData.isRoot) {
        file.data.locale = websiteRoot;
        //extend the local yml data to the page
        data = rootData[dataKey];
      } else if(filePathData.isSubfolder) {
        //set the locale on the page context for modal|partial translation
        file.data.locale = locale;
        file.data.dataKey = dataKey;
        data = translated[dictKey] && translated[dictKey][dataKey];
      }

      //extend the file data with layouts and translations
      if(data) {
        //TODO: figure out how to do this transform earlier
        if(data.page_content) {
          file.content = data.page_content;
        }
        extendWhile(file.data, data);
      }

      //deal with global data
      //this assumes that modals and partials don't access global data
      if(locale !== lastLocale && !filePathData.isModal && !filePathData.isPartial) {
        var globalData = assemble.get('data');

        if(filePathData.isSubfolder) {
          Object.keys(globalData).forEach(function(key) {
            if(/global\_/.test(key)) {
              //intentionally mutate assemble.cache.data
              globalData[key] = translated[dictKey].global[key];
            }
          });
        }

        lastLocale = locale;
      }

    }//end !ppc if
    next();
  };
};
