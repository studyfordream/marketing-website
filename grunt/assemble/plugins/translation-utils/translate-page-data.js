var path = require('path');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');
var fixHTMLEscape = require('./fix-html-escape');

/**
 * Function for iterating the completed pageData object and performing translations appropriately
 * Also, uses the layouts array to find associate layouts and translate (TODO: hack because performing this earlier was breaking Assemble silently)
 *
 * case 1: locale specific file is in the dictionary so use it
 * case 2: file is inherited from the root website so must use a parent key in the dictionary to translate
 */
module.exports = function(assemble){
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var websiteRoot = assemble.get('data.websiteRoot');

  return function translatePageData(locale, lang, pageDataClone, translations) {
    _.forEach(pageDataClone[locale], function(val, fp) {
      var parentPath = fp.replace(path.join(subfoldersRoot, locale), websiteRoot);
      var layoutPaths = pageDataClone[locale][fp].layouts;
      //must first remove the layouts to avoid double translation
      if(layoutPaths) {
        delete pageDataClone[locale][fp].layouts;
      }

      var parentLang = lang[websiteRoot][parentPath];
      if(parentLang){
        var trans = objParser.translate(parentLang, translations);
        fixHTMLEscape(trans);
        _.merge(pageDataClone[locale][fp], trans);
      }

      if(layoutPaths) {
        pageDataClone[locale][fp].layouts = pageDataClone[locale][fp].layouts || {};

        _.forEach(layoutPaths, function(layoutData, layoutPath) {
          var langData = lang.layouts[layoutPath];

          //only translate data from lang dictionary to avoid translating matching phrases not intedend for translation
          objParser.translate(langData, translations);
          fixHTMLEscape(langData);
          _.merge(layoutData, langData);
          //TODO: probably a better way to do this => recreate the layouts object
          pageDataClone[locale][fp].layouts[layoutPath] = layoutData;

        });
      }
    });

  };
};
