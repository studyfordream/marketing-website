var path = require('path');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');
var fixHTMLEscape = require('./fix-html-escape');

module.exports = function(assemble) {
  var removeTranslationKeys = require('../../utils/remove-translation-keys')(assemble);

  return function translateGlobalYml(localeCode, globalYml, translations) {
    var translatedGlobal = Object.keys(globalYml).reduce(function(o, fp) {
      var val = globalYml[fp];
      var basenameKey = path.basename(fp, path.extname(fp));
      var clone = _.cloneDeep(val);

      o[basenameKey] = objParser.translate(clone, translations[localeCode]);
      fixHTMLEscape(o[basenameKey]);
      return o;
    }, {});

    removeTranslationKeys(translatedGlobal);

    return translatedGlobal;
  };
};
