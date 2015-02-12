var extend = require('extend-shallow');
var path = require('path');

module.exports = function(assemble) {
  //sets a key on the assemble instance equal to the collection name
  //this object contains keys of the dirname using dirnameKey rename key function
  //and then the collection is accessed in the template using the collection
  //handlebars helper
  return function collectionMiddleware(collection) {
    return function (file, next) {
      if (!file.data[collection]) {
        return next();
      }
      var col = assemble.get(collection) || {};
      var split = file.path.split('/');
      var ext;
      var dirname = split[split.length - 2];
      var basename = split[split.length - 1];
      if(/\.hbs/.test(basename)) {
        ext = '.hbs';
      } else if (/.\html/.test(basename)) {
        ext = '.html';
      }
      if(ext) {
        basename = path.basename(basename, ext);
      }
      var key = path.join(dirname, basename);
      if(col[key]) {
        return next();
      }
      col[key] = extend({}, col[key], file.data);
      assemble.set(collection, col);
      next();
    };
  };
};
