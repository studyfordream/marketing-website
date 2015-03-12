var path = require('path');
var extend = require('extend-shallow');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');

module.exports = function(assemble) {
  //var mergeTranslated = require('../utils/merge-tranlated-dictionary');
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var extendFileData = require('../utils/extend-file-data')(assemble);
  var environment = assemble.option('environment');
  var websiteRoot = assemble.get('data.websiteRoot');
  var basename = assemble.get('data.basename');
  var locales = assemble.get('data.locales');
  var removeTranslationKeys = require('../utils/remove-translation-keys');
  var isTest = assemble.get('env');

  return function mergeTranslatedData (file, next) {
    var lang = assemble.get('lang');
    var subfoldersRoot = assemble.get('data.subfoldersRoot');
    var pageData = assemble.get('pageData');
    var dicts = assemble.get('dicts');
    var locale, dataKey, localeData, parsedTranslations, filePathData, dictKey, mergedDict, parentKey, parentDict, subfolderDict;

    //get keys for accessing dictionary and locale type
    filePathData = parseFilePath(file.path);
    locale = filePathData.locale;
    dataKey = filePathData.dataKey;
    if(/ab\-testing/.test(file.path) && locale !== websiteRoot) {
      debugger;
    }


    //extend the file with the external YML content
    extendFileData(filePathData, file);

    //TODO: problem this won't work for modals because they are not scoped to the locale???
    //put in custom function for replacing translated array values
    if(filePathData.isSubfolder || ( filePathData.isRoot && isTest === 'test' )) {
      file.data.locale = locale;
      dictKey = locales[locale]; //this gives the dictionary key ex. de_DE from _assemble config
      parentKey = filePathData.parentKey;
      if(filePathData.isRoot) {
        dictKey = 'de_DE';
      }

      /**
       *
       * Enter translation function here
       * on `file` object only need to parse HTML_page_content
       * on `file.data` object parse and replace all content with TR or MD key
       * must iterate through all keys as some TR/MD keys may be nested in non-TR/MD
       * we are not translating modals, layouts, or partials here -- only subfolders
       *
       **/
      //TODO: add if condition from data applied in loader
      // if page has it's own template don't merge dictionary, if not then merge dictionary
      // also if this is the case need to extend the file data with the parent file data
      // thought this was happening in extend-file-data function

      if(!file.hasOwnTemplate && !filePathData.isRoot) {
        mergedDict = extend({}, dicts[dictKey][parentKey], dicts[dictKey][dataKey]);
      }

      // file.path should match value from smartling.js
      file = objParser.translate(file, mergedDict || dicts[dictKey][dataKey]);
      //
      //replace the content of the page if it has been flagged for translation

    } else if (file.data.locale && file.data.locale !== websiteRoot && ( filePathData.isModal || filePathData.isPartial ) ) {
      locale = file.data.locale;
      dictKey = locales[locale];

      //TODO: for now modals/partials are not locale specific, in future may have locale specific
      //partials that possible overwrite parent partial data
      file = objParser.translate(file, dicts[dictKey][dataKey]);
    }

    if(/mobile/.test(file.path) || /ab\-testing/.test(file.path)) {
      debugger;
    }
    removeTranslationKeys(file);

    next();
  };
};
