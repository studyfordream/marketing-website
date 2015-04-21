var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');
var removeTranslationKeys = require('../../utils/remove-translation-keys');

module.exports = function(locale, dictKey, translations, pageDataMap) {
  _.forEach(pageDataMap[locale], function(pageDataObj, fp) {
    var layoutFpKeys = Object.keys(pageDataObj.layouts || {});

    if(layoutFpKeys.length) {
      layoutFpKeys.forEach(function(layoutPath) {
        var layoutData = pageDataObj.layouts[layoutPath];
        objParser.translate(layoutData, translations[dictKey][layoutPath]);

        //important to remove translation keys so conflicting translations from page data are not applied
        removeTranslationKeys(layoutData);
        _.forEach(layoutData, function(layoutVal, layoutKey) {
          if(!pageDataObj.hasOwnProperty(layoutKey)) {
            pageDataObj[layoutKey] = layoutVal;
            console.log(layoutKey);
          }
        });
        //_.merge(pageDataObj, layoutData);
        //console.log(_.intersection(Object.keys(pageDataObj), Object.keys(layoutData)));
      });

      pageDataObj.layouts = layoutFpKeys;
    }


  });

};
