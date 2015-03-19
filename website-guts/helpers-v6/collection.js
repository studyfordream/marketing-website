var _ = require('lodash');
var generateKey = require('../../grunt/assemble/utils/generate-key');
var objParser = require('l10n-tools/object-extractor');
var removeTranslationKeys = require('../../grunt/assemble/utils/remove-translation-keys');

module.exports = function collection (name, options) {
  //get the collection object off of the assemble instance
  //template the data into the hbs and join the strings
  //sort the collection order by the priority key
  var app = this.app;
  var dicts = this.app.get('dicts');
  var locales = this.app.get('data.locales');
  var locale = this.context.locale;
  var dictKey = locale && locales[locale];
  var col = app.get(name);
  var collectionData = Object.keys(col).map(function (key) {
    var data = col[key];
    var dataKey = generateKey(data.src.path);
    if(locale && dicts[dictKey] && dicts[dictKey][dataKey]) {
      objParser.translate(data, dicts[dictKey][dataKey]);
    }
    removeTranslationKeys(data);
    return data;
  });
  var html = _.sortBy(collectionData, 'priority').map(function(data) {
    return options.fn(data);
  }).join('\n');
  return html;
};
