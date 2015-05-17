var moment = require('moment');
window.optly = window.optly || {};
var locale = window.optly.l10n && window.optly.l10n.locale;
var locales = window.optly.l10n && window.optly.l10n.locales;
var langKey;

if(locale && locales && locale !== 'us') {
  langKey = locales[locale];
  if(langKey) {
    moment.locale(langKey);
  } else {
    moment.locale(locale);
  }
}

module.exports = moment;

