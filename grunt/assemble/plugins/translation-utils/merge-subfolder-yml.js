var path = require('path');
var _ = require('lodash');
var globby = require('globby');

module.exports = function(assemble) {
  var parseFilePath = require('../../utils/parse-file-path')(assemble);
  var createTranslationDict = require('../../utils/create-dictionary')(assemble);
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var websiteRoot = assemble.get('data.websiteRoot');
  var subfolderFiles = globby.sync('**/*.{hbs,yml}', {cwd: subfoldersRoot});

  var subfolderO = subfolderFiles.reduce(function(o, fp) {
    var key = '/' + path.join(subfoldersRoot, path.dirname(fp), 'index');
    if(!o[key]) {
      o[key] = [];
    }
    o[key].push(path.extname(fp).replace('.', ''));

    return o;
  }, {});

  var hasNoTemplate = Object.keys(subfolderO).filter(function(fp) {
    var data = subfolderO[fp];
    if(data.length === 1 && data[0] === 'yml') {
      return true;
    }
  });

  return function mergeSubfolderYml(lang, pageDataClone) {
    hasNoTemplate.forEach(function(fp) {
      var filePathData = parseFilePath(fp);
      var locale = filePathData.locale;
      var parentKey = filePathData.parentKey;
      if(pageDataClone[locale] && pageDataClone[locale][fp]) {
        lang[locale][fp] = createTranslationDict(pageDataClone[locale][fp], locale);
        pageDataClone[locale][fp] = _.merge({}, pageDataClone[websiteRoot][parentKey], pageDataClone[locale][fp]);
      }
    });

    return pageDataClone;
  };
};
