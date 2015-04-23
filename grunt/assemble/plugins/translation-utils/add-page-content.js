var _ = require('lodash');

/**
 * @param {Object} rootData `lang[websiteRoot]` the data separated for translation
 * @param {Object} rootPageDataMap `pageDataMap[websiteRoot]` the data cloned from file data objects
 * @return {Object} `pageDataMap[websiteRoot]` the data cloned from file data objects
 */
module.exports = function(rootData, rootPageDataMap) {
  _.forEach(rootData, function(val, fp) {
    var contentKeys = [
      'HTML_page_content',
      //'page_data'
    ];
    var existingKeys = _.intersection(contentKeys, Object.keys(val));

    if(existingKeys.length) {
      existingKeys.forEach(function(key) {
        rootPageDataMap[fp][key] = val[key];
      });
    }
  });

  return rootPageDataMap;

};
