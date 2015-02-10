module.exports = function(assemble, locales) {
  var langLoader = require('../loaders');

  //make more dynamic to get language dirs in an array
  locales.forEach(function(locale) {
    assemble.create(locale.split('-')[1] + '-page', {
      isRenderable: true
    }, [langLoader(assemble, locale)]);
  });
};
