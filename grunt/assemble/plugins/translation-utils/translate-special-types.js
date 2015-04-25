var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');

module.exports = function(assemble){
  var lang = assemble.get('lang');
  var locales = assemble.get('data.locales');
  var specialTypes = [
    'modals',
    'layouts',
    'partials'
  ];

  return function translateSpecialTypes(locale, translated, pageDataClone) {
    var dictKey = locales[locale];

    /**
     * Utility Function for iterating through the special types in the lang object ['modals', 'layouts', 'partials']
     * and merging their filepath/values into the pageDataClone locale object
     */
    specialTypes.forEach(function(type) {
      var keys = Object.keys(lang[type]);
      var translatedTypeObj = keys.reduce(function(o, fp) {
        var helperPhrases = lang[type][fp].TR_helper_phrases;
        if(helperPhrases) {
          delete lang[type][fp].TR_helper_phrases;
          lang[type][fp].helper_phrases = helperPhrases || [];
        }
        o[fp] = objParser.translate(lang[type][fp], translated[dictKey][fp]);
        return o;
      }, {});
      _.merge(pageDataClone[locale], translatedTypeObj || {});
    });

  };
};
