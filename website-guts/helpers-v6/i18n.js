'use strict';

module.exports = function i18n (key, options) {
  var app = this.app;
  var dicts = app.get('dicts');
  var locale = this.context.locale || 'website';
  if (locale === 'website') {
    return key;
  }
  var value = key;
  if (dicts[locale] && dicts[locale][key]) {
    value = dicts[locale][key];
  }
  return value;
};
