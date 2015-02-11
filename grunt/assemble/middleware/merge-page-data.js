var path = require('path');

module.exports = function(assemble) {
  var Plasma = require('plasma');
  //scope data locally and potentially perform translation related dictionary creation
  var plasma = new Plasma();
  return function mergePageData (file, next) {
    // pageData.about
    var key = path.dirname(file.path);
    var data = plasma.load([path.join(key, '*.{json,yaml,yml}')]);
    //if (data) {
      ////console.log('plasma data', data);
    //}

    // extend(file.data, data);
    next();
  };
};