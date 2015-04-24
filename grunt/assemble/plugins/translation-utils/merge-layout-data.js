var _ = require('lodash');

module.exports = function(pageDataClone) {
  _.forEach(pageDataClone, function(typeData, type) {

    _.forEach(typeData, function(fileData, fp) {
      var layoutKeys = Object.keys(fileData.layouts || {});
      var layoutData;

      if(layoutKeys.length) {
        layoutData = layoutKeys.reduce(function(o, key) {
          _.merge(o, fileData.layouts[key]);
          return o;
        }, {});

        //merge the layout data onto the pageDataClone file data
        _.merge(fileData, layoutData);
        //store the layout file paths in an array
        fileData.layouts = layoutKeys;
      }
    });

  });
};

