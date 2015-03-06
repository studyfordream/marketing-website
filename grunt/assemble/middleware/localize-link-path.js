var path = require('path');
//adjust the link paths to include the subfolder name for locales
module.exports = function(assemble) {
  var websiteRoot = assemble.get('data.websiteRoot');

  return function (file, next) {
    var locale = file.data.locale;
    file.data.linkPath = assemble.get('data.linkPath');

    if (locale && locale.length && locale !== websiteRoot) {
      file.data.linkPath += ('/' + locale);
    }
    console.log('linkpath', file.data.linkPath); 
    next();
  };
};
