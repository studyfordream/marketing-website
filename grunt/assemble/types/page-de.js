module.exports = function(assemble) {
  var langLoader = require('../loaders');

  //make more dynamic to get language dirs in an array
  assemble.create('page-de', {
    isRenderable: true
  }, [langLoader('website-de')]);
};
