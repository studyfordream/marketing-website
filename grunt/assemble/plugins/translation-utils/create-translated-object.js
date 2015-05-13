var _ = require('lodash');

module.exports = function(assemble) {
  var locales = assemble.get('data.locales');

  /**
   *
   * Creates an object with all translations scoped to filepath per language key
   * i.e. (de & chde) have the same language key `de_DE`
   *
   * @param {String} `locale` locale to check
   * @param {Object} `pageDataClone` page data object
   * @return {Object} an object with all translated data per language key scoped under filepath
   */
  return function createTranslatedObject(localeCode, pageDataClone) {
    /**
     * filter to add all locales with the same language key to tranlated object
     */
    var filteredLocales = Object.keys(pageDataClone).filter(function(pageDataKey) {
      if(locales[pageDataKey] === localeCode) {
        return true;
      }
    });

    /**
     * loop over all locales that are associated with the same localeCode and add them
     * to an object by file path
     */
    return filteredLocales.reduce(function(o, pageDataKey) {
      _.forEach(pageDataClone[pageDataKey], function(val, fp) {
        if(!o.hasOwnProperty(fp)) {
          o[fp] = _.cloneDeep(val);
        }
      });

      return o;
    }, {});

  };
};
