var _ = require('lodash');
var path = require('path');
var globby = require('globby');
var objParser = require('l10n-tools/object-extractor');

/**
 * Function that merges external yml and attaches it to the page data object. If a subfolder
 * has external yml but not it's own template it must be translated on the fly from two different
 * dictionary entries.
 *
 * case 1: locale template exists
 * case 2: only external yml exists, must inherit external yml from parent and tranlsate on the fly
 *
 */
module.exports = function(assemble) {
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var websiteRoot = assemble.get('data.websiteRoot');
  var pageData = assemble.get('pageData');
  var locales = assemble.get('data.locales');
  var lang = assemble.get('lang');
  var subfolderFiles = globby.sync('**/*.{hbs,yml}', {cwd: subfoldersRoot});
  var subfolderO = subfolderFiles.reduce(function(o, fp) {
    var key = '/' + path.join(subfoldersRoot, path.dirname(fp), 'index');
    if(!o[key]) {
      o[key] = [];
    }
    o[key].push(path.extname(fp).replace('.', ''));

    return o;
  }, {});

  return function(locale, pageDataMap, translations) {
    var dictKey = locales[locale];

    Object.keys(lang[locale]).forEach(function(fp) {
      var subfolderFiles = subfolderO[fp];
      var parentKey = fp.replace(path.join(subfoldersRoot, locale), websiteRoot);
      var data;

      if(subfolderFiles.length === 1 && subfolderFiles[0] === 'yml') {
        data = _.merge({}, lang[websiteRoot][parentKey], lang[locale][fp]);
        //translate here because it is difficult to reconcile later
        //objParser.translate(data, translations[dictKey][fp]);
        objParser.translate(data, translations[dictKey][parentKey]);
        pageDataMap[locale][fp] = _.merge({}, pageData[websiteRoot][parentKey], pageData[locale][fp], data);
      } else {
        data = _.clone(lang[locale][fp]);
        //objParser.translate(data, translations[dictKey][fp]);
        pageDataMap[locale][fp] = _.merge({}, pageData[locale][fp], data);
      }

    });

  };
};
