var path = require('path');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');
var removeTranslationKeys = require('../../utils/remove-translation-keys');

module.exports = function translateGlobalYml(localeCode, globalYml, translations) {
  var translatedGlobal = Object.keys(globalYml).reduce(function(o, fp) {
    var val = globalYml[fp];
    var basenameKey = path.basename(fp, path.extname(fp));
    var clone = _.cloneDeep(val);

    o[basenameKey] = objParser.translate(clone, translations[localeCode]);
    return o;
  }, {});

  removeTranslationKeys(translatedGlobal);

  return translatedGlobal;
};
