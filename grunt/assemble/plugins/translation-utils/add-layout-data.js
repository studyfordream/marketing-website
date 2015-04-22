var _ = require('lodash');

module.exports = function(file, filePathData, pageDataMap, isTest) {
  var locale = filePathData.locale;
  var dataKey = filePathData.dataKey;
  var layoutCache = [];
  pageDataMap[locale] = pageDataMap[locale] || {};
  pageDataMap[locale][dataKey] = pageDataMap[locale][dataKey] || {};
  var localeData = pageDataMap[locale][dataKey];

  if(filePathData.isSubfolder || filePathData.isRoot || isTest) {
    if(file.data.layouts) {
      _.forEach(file.data.layouts, function(val, layoutPath) {

        _.forEach(val, function(layoutContext, layoutDataKey) {
          localeData[layoutDataKey] = layoutContext;
        });

        layoutCache.push(layoutPath);
      });

    }
  }

  localeData.layouts = layoutCache;

  return file;
};
