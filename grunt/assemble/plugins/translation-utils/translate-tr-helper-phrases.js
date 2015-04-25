var path = require('path');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');

module.exports = function(assemble){
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var websiteRoot = assemble.get('data.websiteRoot');
  var parseFilePath = require('../../utils/parse-file-path')(assemble);

  return function translateTrHelperPhrases(locale, dictKey, pageDataClone, translations) {

    _.forEach(pageDataClone[locale], function(fileData, fp) {
      var helperPhrases = fileData.helper_phrases;
      var parentKey = parseFilePath(fp).parentKey;
      var helperObj, dict;

      if(helperPhrases && helperPhrases.length) {
        dict = (translations[dictKey] && translations[dictKey][fp]) || translations[dictKey][parentKey];
        fileData.helper_phrases = Object.keys(dict).reduce(function(o, englishPhrase) {
          if(helperPhrases.indexOf(englishPhrase) !== -1) {
            o[englishPhrase] = dict[englishPhrase];
          }
          return o;
        }, {});
      } else {
        fileData.helper_phrases = {};
      }

    });

  };
};
