var path = require('path');
var extend = require('extend-shallow');
var _ = require('lodash');

function isIndex(fp, testStr) {
  if(fp[0] !== '/') {
    fp = '/' + fp;
  }
  return fp.indexOf('/' + testStr + '/') !== -1;
}

module.exports = function(assemble) {
  var mergeTranslated = require('../utils/merge-tranlated-dictionary');
  var environment = assemble.option('environment');
  var websiteRoot = assemble.get('data.websiteRoot');
  var basename = assemble.get('data.basename');
  var locales = assemble.get('data.locales');
  var cachedTypes = [];

  return function mergeTranslatedData (file, next) {
    var subfoldersRoot = assemble.get('data.subfoldersRoot');
    var pageData = assemble.get('pageData');
    var translated = assemble.get('translated');
    var pagesNamespace = 'page_content';
    var allRoots = Object.keys(locales).concat(websiteRoot);
    var locale, page, data, modalData;
    var pagePath = true;
    var cached = false;
    var dataKey = path.join( path.dirname(file.path), path.basename(file.path, path.extname(file.path)) ).replace(process.cwd(), '');
    var localeIndex, localeKey;

    if( isIndex(file.path, websiteRoot) ) {
      locale = websiteRoot;
    } else if( isIndex(file.path, subfoldersRoot) ) {
      localeIndex = _.findIndex(Object.keys(locales), function(locale) {
        var split = file.path.replace(process.cwd(), '').replace(subfoldersRoot, '').split('/');
        return split.indexOf(locale) !== -1;
      });
      locale = Object.keys(locales)[localeIndex];
    } else {
      pagePath = false;
      locale = path.dirname(file.path).split('/').slice(-1)[0];
      page = path.join(locale, path.basename(file.path, path.extname(file.path)));
      //if(cachedTypes.indexOf(page) === -1) {
        //cachedTypes.push(page);
      //} else {
        //cached = true;
      //}
      //console.log(page);
    }

    localeKey = locales[locale];

    //if(pagePath) {
      ////if it's a page file other than the root homepage the path is the dirname
      //page = path.dirname(file.path).split('/').slice(-1)[0];

      ////if the page is the root homepage normalize it's key to `index`
      //if(allRoots.indexOf(page) !== -1) {
        //page = path.basename(file.path, path.extname(file.path));
      //}
    //}

    if(pageData[locale] && pageData[locale][dataKey]) {
      extend(file.data, pageData[locale][dataKey]);
    }

    //TODO: problem this won't work for modals because they are not scoped to the locale???
    //put in custom function for replacing translated array values
    //if(translated[localeKey] && translated[localeKey][dataKey]) {
      ////replace the content of the page if it has been parsed for translation
      //if(translated[locale][dataKey].HTML_page_content) {
        //file.content = translated[locale][dataKey].HTML_page_content;
      //}
      //mergeTranslated(file.data, translated[locale][dataKey], true); //mutate the file.data object
      ////file.data = mergeTranslated(file.data, translated[locale][page]);
    //}

    next();
  };
};
