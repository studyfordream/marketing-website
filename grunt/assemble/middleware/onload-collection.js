var extend = require('extend-shallow');

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
      var key = assemble.option('renameKey')(file.path);
      col[key] = extend({}, col[key], file.data);
      assemble.set(collection, col);
      next();
    };
  };
};
