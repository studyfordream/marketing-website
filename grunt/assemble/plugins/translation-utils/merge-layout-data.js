var _ = require('lodash');

module.exports = function mergeLayoutData(pageDataClone) {
  _.forEach(pageDataClone, function(typeData, locale) {

    _.forEach(typeData, function(fileData, fp) {
      var layoutKeys = Object.keys(fileData.layouts || {});

      if(layoutKeys.length) {
        var layoutData = layoutKeys.reduce(function(memo, key) {
          _.merge(memo, fileData.layouts[key]);
          return memo;
        }, {});

        //merge the layout data onto the pageDataClone file data
        _.merge(fileData, layoutData);
        //store the layout file paths in an array
        fileData.layouts = layoutKeys;
      }
    });

  });
};
