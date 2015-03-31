var _ = require('lodash');
var path = require('path');
var generateKey = require('../../grunt/assemble/utils/generate-key');
var objParser = require('l10n-tools/object-extractor');
var removeTranslationKeys = require('../../grunt/assemble/utils/remove-translation-keys');

module.exports = function collection (name, options) {
  //get the collection object off of the assemble instance
  //template the data into the hbs and join the strings
  //sort the collection order by the priority key
  var app = this.app;
  var websiteRoot = this.app.get('data.websiteRoot');
  var subfoldersRoot = this.app.get('data.subfoldersRoot');
  var translated = this.app.get('translated');
  var locales = this.app.get('data.locales');
  var locale = this.context.locale;
  var dictKey = locale && locales[locale];
  var col = app.get(name);
  var collectionData = Object.keys(col).map(function (key) {
    var translationKey;
    var data = col[key];
    var rootKey = generateKey(data.src.path);
    var dataKey = rootKey.replace('/' + websiteRoot + '/', '/' + path.join(subfoldersRoot, locale) + '/');
    var translations = translated[dictKey] && translated[dictKey][dataKey];
    if(dictKey && translations) {
      _.forEach(translations, function(val, key) {
        if(data.hasOwnProperty(key)) {
          data[key] = val;
        }
      });
    }
    data.rootKey = rootKey;

    return data;
  });

  var html = _.sortBy(collectionData, 'priority').map(function(data) {
    return options.fn(data);
  }).join('\n');
  return html;
};
