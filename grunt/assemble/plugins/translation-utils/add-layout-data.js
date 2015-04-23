var _ = require('lodash');

module.exports = function(file) {
  var layoutData = file.data.layouts;

  if(file.data.layouts) {
    return Object.keys(layoutData).reduce(function(o, key) {

      _.forEach(layoutData[key], function(layoutContext, layoutDataKey) {
        o[layoutDataKey] = layoutContext;
      });

      if(_.isArray(o.layouts)) {
        o.layouts.push(key);
      } else {
        o.layouts = [key];
      }

      return o;
    }, {});
  } else {
    return {};
  }

};
