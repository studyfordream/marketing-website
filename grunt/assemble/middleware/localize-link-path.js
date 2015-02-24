//adjust the link paths to include the subfolder name for locales
module.exports = function(assemble) {
  var websiteRoot = assemble.get('data.websiteRoot');
  return function (file, next) {
    var dirname = file.options.params[1];
    dirname = dirname.replace(process.cwd(), '');

    var locale = dirname.split('/')[0];
    file.data.linkPath = assemble.get('data.linkPath');
    if (locale && locale.length && locale !== websiteRoot) {
      file.data.linkPath += ('/' + locale);
    }
    next();
  };
};