/**
 * Utility function to append locale specific data to oForm payload object sent to /account/create endpoint
 *
 * @param {String} `data` string of form data encoded by oForm
 * @return {String} encoded locale string to be appended to the oForm `data` string in the oForm middleware
 */

module.exports = function() {
  var DEFAULT_KEY = 'en_US';
  var tld = window.location.hostname.split('.').pop();
  var langKey;

  if(window.optly.l10n && window.optly.l10n.locales) {
    for(var key in window.optly.l10n.locales) {
      if(key === tld) {
        langKey = window.optly.l10n.locales[key];
        break;
      }
    }
  }

  if(!langKey) {
    langKey = DEFAULT_KEY;
  }

  return window.encodeURI('&locale=' + langKey);
};
