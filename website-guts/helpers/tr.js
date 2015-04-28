var path = require('path');
var chalk = require('chalk');
var tr = require('l10n-tr');
var generateKey = require('../../grunt/assemble/utils/generate-key');

module.exports = function _tr(key) {
  var app = this.app;
  var websiteRoot = app.get('data.websiteRoot');
  var locales = app.get('data.locales');
  var isTest = app.get('env') === 'test';
  var locale = this.context.locale || websiteRoot;
  var dict = app.get('translated');
  if (locale === websiteRoot && !isTest) {
    return key;
  }
  var dataKey = this.context.dataKey;
  var dictKey = isTest ? 'de_DE' : locales[locale];
  var ogPath = generateKey('/' + this.context.originalPath);
  var helperData = dict[dictKey][ogPath] && dict[dictKey][ogPath].helper_phrases;
  var translation, modalHelpers = this.context.modals && this.context.modals.helper_phrases;
  if (helperData) {
    tr.setDict(helperData);
    translation = tr.apply(tr, arguments);
  } else {
    translation = key;
    console.error(chalk.red.bold('TR Helper Translation not found for: ', key, ogPath));
  }
  //lastLocale = locale;
  return translation;
};
