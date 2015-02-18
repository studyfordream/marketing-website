var path = require('path');
var extend = require('extend-shallow');

module.exports = function(assemble) {
  var lang = assemble.get('lang');

  return function mergePageData (file, next) {
    // pageData.about

    // normalize key
    var key = path.dirname(file.path);
    var index = key.indexOf('/website');
    if ( index !== -1) {
      key = key.substr(index + 1);
    }

    // find the locale
    var locale = key.split('/')[0];

    // find the page name
    var page = key.split('/').slice(-1)[0];

    var data = lang[locale] || {};
    file.data = extend({}, file.data, data[page]);

    // lang[locale] = lang[locale] || {};

    // // add any page data
    // lang[locale][page] = extend({}, lang[locale][page], file.data);
    next();
  };
};
