var _ = require('lodash');

module.exports = function createTranslatedObject(locales, localeCode, pageDataClone) {
  var filteredLocales = Object.keys(pageDataClone).filter(function(pageDataKey) {
    if(locales[pageDataKey] === localeCode) {
      return true;
    }
  });

  return filteredLocales.reduce(function(o, pageDataKey) {
    _.forEach(pageDataClone[pageDataKey], function(val, fp) {
      var helpers;
      if(!o.hasOwnProperty(fp)) {
        if(val.helper_phrases) {
          helpers = val.helper_phrases;
          delete val.helper_phrases;
        }
        o[fp] = _.extend({}, val, helpers ? {helper_phrases: helpers} : {});
      }
    });

    return o;
  }, {});

};
