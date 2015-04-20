var _ = require('lodash');

module.exports = function(file, filePathData, isTest) {
  var layoutCache = [];

  if(filePathData.isSubfolder || filePathData.isRoot || isTest) {
    if(file.data.layouts) {
    console.log('BEFORE', Object.keys(file.data));
      _.forEach(file.data.layouts, function(val, layoutPath) {
        _.forEach(val, function(layoutContext, layoutDataKey) {
          file.data[layoutDataKey] = layoutContext;
        });

        layoutCache.push(layoutPath);
      });
    console.log('AFTER', Object.keys(file.data));
    }
  }

  file.data.layouts = layoutCache;

  return file;
};
