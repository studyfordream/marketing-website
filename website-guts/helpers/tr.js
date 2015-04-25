var path = require('path');
var chalk = require('chalk');
var tr = require('l10n-tools/tr');

module.exports = function _tr(key) {
  var app = this.app;
  var websiteRoot = app.get('data.websiteRoot');
  var locales = app.get('data.locales');
  var isTest = app.get('env') === 'test';
  var locale = this.context.locale || websiteRoot;
  if (locale === websiteRoot && !isTest) {
    return key;
  }
  var dataKey = this.context.dataKey;
  var dictKey = isTest ? 'de_DE' : locales[locale];
  var translation;
  if (this.context.helper_phrases) {
    tr.setDict(this.context.helper_phrases);
    translation = tr.apply(tr, arguments);
  } else {
    translation = key;
    console.error(chalk.red.bold('TR Helper Translation not found for: ', key, path.dirname(this.context.originalPath)));
  }
  return translation;
};
