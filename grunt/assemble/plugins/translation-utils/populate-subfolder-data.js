var _ = require('lodash');
var path = require('path');

module.exports = function(locale, websiteRoot, subfoldersRoot, pageData, pageDataMap) {
  /**
   * Function for populating the page data object with filepath related objects inherited from the parent website
   * if they do not have their own templates or yml files in subfolders.
   *
   */
  _.forEach(pageDataMap[websiteRoot], function(val, fp) {
    var subfolderPath = fp.replace('/' + websiteRoot + '/', '/' + path.join(subfoldersRoot, locale) + '/');
    if(!pageDataMap[locale][subfolderPath]) {
      val = _.clone(val);
      //have to merge here or lose values not flagged for translation
      pageDataMap[locale][subfolderPath] = _.merge({}, pageData[websiteRoot][fp] || {}, val);
    }
  });

};
