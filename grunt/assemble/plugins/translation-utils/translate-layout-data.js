var _ = require('lodash');
var path = require('path');
var objParser = require('l10n-tools/object-extractor');
var removeTranslationKeys = require('../../utils/remove-translation-keys');
var websiteRoot = 'website';
var subfoldersRoot = 'subfolders';

module.exports = function(locale, dictKey, translations, pageDataMap) {
  //_.forEach(pageDataMap[locale], function(pageDataObj, fp) {
    //var layoutFpKeys = Object.keys(pageDataObj.layouts || {});

    //if(layoutFpKeys.length) {
      //layoutFpKeys.forEach(function(layoutPath) {
        //var layoutData = pageDataObj.layouts[layoutPath];
        //objParser.translate(layoutData, translations[dictKey][layoutPath]);

        ////important to remove translation keys so conflicting translations from page data are not applied
        //removeTranslationKeys(layoutData);
        //_.forEach(layoutData, function(layoutVal, layoutKey) {
          //if(!pageDataObj.hasOwnProperty(layoutKey)) {
            //pageDataObj[layoutKey] = layoutVal;
            //console.log(layoutKey);
          //}
        //});
        ////_.merge(pageDataObj, layoutData);
        ////console.log(_.intersection(Object.keys(pageDataObj), Object.keys(layoutData)));
      //});

      //pageDataObj.layouts = layoutFpKeys;
    //}


  //});

  _.forEach(pageDataMap[locale], function(pageDataObj, fp) {
    var layoutObj, fpDictKey;

    if(pageDataObj.layouts) {
      layoutObj = pageDataObj.layouts;
      //layoutObj = layoutData[locale][fp];
      //fpDictKey = fp;
    }
    //console.log(fpDictKey);


    _.forEach(layoutObj, function(val, layoutPath) {
      var clone = _.clone(val);
      if(_.isPlainObject(pageDataMap[locale][fp].layouts) || !pageDataMap[locale][fp].layouts) {
        pageDataMap[locale][fp].layouts = [];
      }
      pageDataMap[locale][fp].layouts.push(layoutPath);
      //must translate here because need the layout key path
      objParser.translate(clone, translations[dictKey][layoutPath]);
      _.extend(pageDataMap[locale][fp], clone);
    });

    //delete pageDataMap[websiteRoot][fp].layouts;
  });
};
