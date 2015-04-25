var _ = require('lodash');

module.exports = function mergeLayoutData(pageDataClone) {
  _.forEach(pageDataClone, function(typeData, type) {

    _.forEach(typeData, function(fileData, fp) {
      var layoutKeys = Object.keys(fileData.layouts || {});
      var layoutData, trHelperCache = {};

      if(layoutKeys.length) {
        layoutData = layoutKeys.reduce(function(o, key) {
          var data = fileData.layouts[key];
          var helperData = ( typeData[key] && typeData[key].helper_phrases ) || {};
          if(_.isArray(helperData)) {
            delete typeData[key].helper_phrases;
          } else {
            data.helper_phrases = helperData;
          }
          _.merge(o, data);
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

