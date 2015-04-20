var _ = require('lodash');

module.exports = function(file, filePathData, pageDataMap, isTest) {
  var layoutCache = [];

  if(filePathData.isSubfolder || filePathData.isRoot || isTest) {
    if(file.data.layouts) {
      _.forEach(file.data.layouts, function(val, layoutPath) {

        _.forEach(val, function(layoutContext, layoutDataKey) {
          pageDataMap[layoutDataKey] = layoutContext;
        });

        layoutCache.push(layoutPath);
      });

    }
  }

  file.data.layouts = layoutCache;

  return file;
};
