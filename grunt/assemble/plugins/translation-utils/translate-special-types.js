var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');
var fixHTMLEscape = require('./fix-html-escape');

module.exports = function(assemble){
  var lang = assemble.get('lang');
  var specialTypes = [
    'modals',
    'layouts',
    'partials'
  ];

  /**
   * Utility Function for iterating through the special types in the lang object ['modals', 'layouts', 'partials']
   * and merging their filepath/values into the pageDataClone locale object
   */
  return function translateSpecialTypes(locale, translations, pageDataClone) {
    specialTypes.forEach(function(type) {
      var keys = Object.keys(lang[type]);
      var translatedTypeObj = keys.reduce(function(memo, fp) {
        memo[fp] = objParser.translate(lang[type][fp], translations);
        fixHTMLEscape(memo[fp]);
        return memo;
      }, {});
      _.merge(pageDataClone[locale], translatedTypeObj);
    });

  };
};
