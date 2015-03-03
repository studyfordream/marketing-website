var path = require('path');
var extend = require('extend-shallow');
var _ = require('lodash');

module.exports = function(assemble) {
  var mergeTranslated = require('../utils/merge-tranlated-dictionary');
  var environment = assemble.option('environment');
  var websiteRoot = assemble.get('data.websiteRoot');
  var basename = assemble.get('data.basename');
  var locales = assemble.get('data.locales');
  var cachedTypes = [];

  return function mergeTranslatedData (file, next) {
    var pageData = assemble.get('pageData');
    var translated = assemble.get('translated');
    var pagesNamespace = 'page_content';
    var allRoots = locales.concat(websiteRoot);
    var locale, page, data, modalData;
    var pagePath = true;
    var cached = false;
    var rootIndex = file.path.indexOf('/' + websiteRoot + '/');
    var localeIndex = _.findIndex(locales, function(locale) {
      var re = new RegExp(locale);
      return re.test(file.path);
    });

    if(rootIndex !== -1) {
      locale = websiteRoot;
    } else if(localeIndex !== -1) {
      locale = locales[localeIndex];
    } else {
      pagePath = false;
      locale = path.dirname(file.path).split('/').slice(-1)[0];
      page = path.join(locale, path.basename(file.path, path.extname(file.path)));
      if(cachedTypes.indexOf(page) === -1) {
        cachedTypes.push(page);
      } else {
        cached = true;
      }
      //console.log(page);
    }

    if(pagePath) {
      //if it's a page file other than the root homepage the path is the dirname
      page = path.dirname(file.path).split('/').slice(-1)[0];

      //if the page is the root homepage normalize it's key to `index`
      if(allRoots.indexOf(page) !== -1) {
        page = path.basename(file.path, path.extname(file.path));
      }
    }

    if(pageData[locale] && pageData[locale][page]) {
      extend(file.data, pageData[locale][page]);
    }

    //put in custom function for replacing translated array values
    if(translated[locale] && translated[locale][page]) {
      mergeTranslated(file.data, translated[locale][page], true); //mutate the file.data object
      //file.data = mergeTranslated(file.data, translated[locale][page]);
    }

    next();
  };
};
