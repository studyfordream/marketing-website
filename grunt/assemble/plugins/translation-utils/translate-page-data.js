var path = require('path');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');

/**
 * Function for iterating the completed pageData object and performing translations appropriately
 * Also, uses the layouts array to find associate layouts and translate (TODO: hack because performing this earlier was breaking Assemble silently)
 *
 * case 1: locale specific file is in the dictionary so use it
 * case 2: file is inherited from the root website so must use a parent key in the dictionary to translate
 */
module.exports = function(locale, dictKey, lang, websiteRoot, subfoldersRoot, pageDataMap, translations) {
  _.forEach(pageDataMap[locale], function(val, fp) {
    var parentPath = fp.replace(path.join(subfoldersRoot, locale), websiteRoot);
    var layoutPaths = pageDataMap[locale][fp].layouts;
    //must first remove the layouts to avoid double translation
    if(layoutPaths) {
      delete pageDataMap[locale][fp].layouts;
    }


    var parentTranslations = translations[dictKey][parentPath];
    var childTranslations = translations[dictKey][fp];
    var parentLang = lang[websiteRoot][parentPath];
    var childLang = lang[locale][fp];

    var parentTrans = objParser.translate(parentLang || {}, parentTranslations);
    var childTrans = objParser.translate(childLang || {}, childTranslations);

    //var translationObj = translations[dictKey][fp] || translations[dictKey][parentPath];
    //merge child and parent paths to account for locale inheritance
    //var langObj = _.merge({}, lang[websiteRoot][parentPath], lang[locale][fp]);
    //objParser.translate(langObj, translationObj);
    //console.log(langObj, fp);
    _.merge(pageDataMap[locale][fp], parentTrans, childTrans);

    if(layoutPaths) {
      pageDataMap[locale][fp].layouts = pageDataMap[locale][fp].layouts || {};

      _.forEach(layoutPaths, function(layoutData, layoutPath) {
        var langData = lang.layouts[layoutPath];

        //only translate data from lang dictionary to avoid translating matching phrases not intedend for translation
        objParser.translate(langData, translations[dictKey][layoutPath]);
        _.merge(layoutData, langData);
        //TODO: probably a better way to do this => recreate the layouts object
        pageDataMap[locale][fp].layouts[layoutPath] = layoutData;

      });
    }
  });

};
