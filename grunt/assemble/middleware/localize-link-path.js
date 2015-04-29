//adjust the link paths to include the subfolder name for locales
module.exports = function(assemble) {
  var websiteRoot = assemble.get('data.websiteRoot');
  var isTest = assemble.get('env') === 'test';

  return function (file, next) {
    var locale = file.data.locale;
    file.data.linkPath = assemble.get('data.linkPath');
    if(isTest) {
      return next();
    }

    if (locale && locale.length && locale !== websiteRoot) {
      file.data.linkPath += ('/' + locale);
    }
    next();
  };
};
