'use strict';

module.exports = function i18n (key, options) {
  var app = this.app;
  var dicts = app.get('dicts');
  var locale = this.context.locale || 'website';
  if (locale === 'website') {
    return key;
  }
  var dataKey = this.context.dataKey;
  var locales = app.get('data.locales');
  var dictKey = locales[locale];
  var value = key;
  if (dicts[dictKey] && dicts[dictKey][dataKey] && dicts[dictKey][dataKey][key]) {
    value = dicts[dictKey][dataKey][key];
  }
  return value;
};
