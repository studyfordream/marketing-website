var _ = require('lodash');
//var ignoreKeys = [
  //'src',
  //'dest',
  //'layout'
//];

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
module.exports = function(file) {
  var data = file.data;

  return Object.keys(data).reduce(function(o, key) {
    if(/^(MD|TR|HTML)_/.test(key)) {
      o[key] = data[key];
    }
    return o;
  }, {});
};
