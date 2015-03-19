var path = require('path');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');

module.exports = function(assemble) {
  //var mergeTranslated = require('../utils/merge-tranlated-dictionary');
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var extendFileData = require('../utils/extend-file-data')(assemble);
  var websiteRoot = assemble.get('data.websiteRoot');
  var locales = assemble.get('data.locales');
  var removeTranslationKeys = require('../utils/remove-translation-keys');
  var isTest = assemble.get('env') === 'test';
  var globalData = _.clone(assemble.get('data'));
  var globalYml = Object.keys(globalData).reduce(function(o, key) {
    if(/global\_/.test(key)) {
      o[key] = globalData[key];
      delete globalData[key];
    }
    return o;
  }, {});
  var lastLocale;

  return function mergeTranslatedData (file, next) {
    var lang = assemble.get('lang');
    var subfoldersRoot = assemble.get('data.subfoldersRoot');
    var pageData = assemble.get('pageData');
    var dicts = assemble.get('dicts');
    var filePathData = parseFilePath(file.path);
    var locale = isTest ? 'de' : filePathData.locale;
    var dataKey = filePathData.dataKey;
    var dictKey = locales[locale];
    var mergedDict, parentKey;

    //extend the file with the external YML content
    extendFileData(filePathData, file);

    //TODO: problem this won't work for modals because they are not scoped to the locale???
    //put in custom function for replacing translated array values
    if(filePathData.isSubfolder || ( filePathData.isRoot && isTest && !file.data.isPpc )) {
      //set the locale on the page context for modal|partial translation
      file.data.locale = locale;
      file.data.dataKey = dataKey;

      //get the parent key for extending subfolder data allowing for conent swaps
      parentKey = filePathData.parentKey;
      // if page has it's own template don't merge dictionary, if not then merge dictionary
      // also if this is the case need to extend the file data with the parent file data
      // thought this was happening in extend-file-data function
      if(!file.hasOwnTemplate && !filePathData.isRoot) {
        mergedDict = _.merge({}, dicts[dictKey][parentKey], dicts[dictKey][dataKey]);
      }

      //replace the content of the page if it has been flagged for translation
      file = objParser.translate(file, mergedDict || dicts[dictKey][dataKey]);

    } else if ( (isTest || ( file.data.locale && file.data.locale !== websiteRoot ) ) && ( filePathData.isModal || filePathData.isPartial ) ) {
      locale = file.data.locale;
      file.data.dataKey = dataKey;

      //TODO: for now modals/partials are not locale specific, in future may have locale specific
      //partials that possible overwrite parent partial data
      if(!file.data.isPpc && dicts[dictKey] && dicts[dictKey][dataKey]) {
        file = objParser.translate(file, dicts[dictKey][dataKey]);
      }
    }
    //deal with global data
    //this assumes that modals and partials don't access global data
    var clone, setGlobal;
    if(!filePathData.isModal && !filePathData.isPartial && locale !== lastLocale && !file.data.isPpc) {
      clone = _.clone(globalYml);
      Object.keys(clone).forEach(function(key) {
        var basenameKey = path.basename(key, path.extname(key));
        if((isTest || locale !== websiteRoot) && dicts[dictKey] && dicts[dictKey][key]) {
          objParser.translate(clone[key], dicts[dictKey][key]);
        }
        clone[basenameKey] = clone[key];
        delete clone[key];
      });
      setGlobal = _.merge({}, globalData, clone);
      removeTranslationKeys(setGlobal);
      assemble.set('data', setGlobal);
      lastLocale = locale;
    }

    //remove all the TR|MD|HTML prefixes
    removeTranslationKeys(file);
    next();
  };
};
