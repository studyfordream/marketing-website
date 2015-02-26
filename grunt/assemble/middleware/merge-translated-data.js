var path = require('path');
var extend = require('extend-shallow');
var _ = require('lodash');

module.exports = function(assemble) {
  var environment = assemble.option('environment');
  var websiteRoot = assemble.get('data.websiteRoot');
  var basename = assemble.get('data.basename');
  var locales = assemble.get('data.locales');

  return function mergePageData (file, next) {
    var translated = assemble.get('translated');
    var pagesNamespace = 'page_content';
    var locale, page, data, modalData, pageData;
    var modalsKey = 'modals';
    var key = path.dirname(file.path);
    var rootIndex = key.indexOf('/' + websiteRoot + '/');
    var localeIndex = _.findIndex(locales, function(locale) {
      var re = new RegExp(locale);
      return re.test(key);
    });

    if(rootIndex !== -1) {
      key = key.substr(rootIndex + 1);
      locale = websiteRoot;
    } else if(localeIndex !== -1) {
      locale = locales[localeIndex];
    }

    //specific logic for translating modal data from `translated` object
    //lang.modals[<modal_file_name_no_ext>]
    if(/modal/.test(key)) {
      //if it's a modal file the key is the filename
      page = path.basename(file.path, '.hbs');
      data = translated[modalsKey];
    } else {
      data = translated[locale || websiteRoot];

      //if it's a page file the path is the dirname
      //after the language tranformation this appends language specific data
      //to the file data
      page = key.split('/').slice(-1)[0];
      //if it's the root homepage then set the name to the basename `index`
      if(page.indexOf(locale) !== -1) {
        page = path.basename(file.path, '.hbs');
      }
      if(/customer\-stories/.test(file.path)) {
        debugger;
      }
    }

    file.data = extend({}, file.data, data[page]);
    next();
  };
};
