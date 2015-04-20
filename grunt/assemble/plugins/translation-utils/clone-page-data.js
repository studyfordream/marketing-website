var _ = require('lodash');
var addLayoutData = require('./add-layout-data');
var ignoreKeys = [
  'src',
  'dest',
  'layout'
];

/**
 * pageDataMap creates a mirror or file data YFM
 * {
 *   website: {
 *     fp: yfmData
 *   },
 *   modals: {
 *     fp: yfmData
 *   },
 *   de: {
 *     fp: yfmData
 *   }
 * }
 * lang[locale][dataKey] => all keys flagged for translation from YFM
 */
module.exports = function(file, filePathData, pageDataMap, pageData, isTest) {
  var locale = filePathData.locale;
  var dataKey = filePathData.dataKey;
  pageDataMap[locale] = pageDataMap[locale] || {};
  pageDataMap[locale][dataKey] = pageDataMap[locale][dataKey] || {};

  _.forEach(file.data, function(val, key) {
    //TODO: figure out why values that are not flagged for translation are getting added to
    //pageDataMap object
    if(ignoreKeys.indexOf(key) === -1 && /^(MD|TR|HTML)_/.test(key)) {
      pageDataMap[locale][dataKey][key] = val;
    }
  });

  //add the layout data onto the file object
  //important to do this before clonePageData because layout data must be added to the file object
  addLayoutData(file, filePathData, pageDataMap[locale][dataKey], isTest);

  if(pageData[locale] && pageData[locale][dataKey]) {
    _.merge(pageDataMap[locale][dataKey], pageData[locale][dataKey]);
  }

  return pageDataMap;
};
