var _ = require('lodash');

module.exports = function(assemble) {
  var websiteRoot = assemble.get('data.websiteRoot');
  var localeKeys = Object.keys(assemble.get('data.locales'));
  localeKeys.unshift(websiteRoot);

  return function mergeLayoutData(pageDataClone) {
    localeKeys.forEach(function(locale) {
      var typeData = pageDataClone[locale];

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
};
