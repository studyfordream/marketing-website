module.exports = function(assemble, locales) {
  var langLoader = require('../loaders/subfolders-loader');

  //make more dynamic to get language dirs in an array
  assemble.create('subfolder', {
    isRenderable: true
  }, [langLoader(assemble, locales)]);
};
