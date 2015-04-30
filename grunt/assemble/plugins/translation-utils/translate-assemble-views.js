var _ = require('lodash');
var path = require('path');
var removeTranslationKeys = require('../../utils/remove-translation-keys');
var types = [
  'partials',
  'modals'
];
var ignoreKeys = [
  'page_content',
  'seo_title',
  'hbs_extracted'
];

module.exports = function(assemble) {
  var websiteGuts = assemble.get('data.websiteGuts');
  var locales = assemble.get('data.locales');
  var views = assemble.views;

  return function translateAssembleViews(translated) {
    types.forEach(function(type) {
      var view = views[type];
      if(type === 'modals') {
        type = path.join('components', type);
      }

      _.forEach(view, function(typeData, typeName) {
        var split = typeName.split('_');
        var localePrefix = split.shift();
        var dictKey = locales[localePrefix];
        var typePath, restructuredName, trans;
        if(dictKey) {
          restructuredName = split.join('_');
          typePath = '/' + path.join(websiteGuts, 'templates', type, restructuredName);
          trans = ( translated[dictKey] && translated[dictKey][typePath] ) || {};
          removeTranslationKeys(typeData.data);
          if(trans.page_content) {
            typeData.content = trans.page_content;
          }

          //attach any YFM to the context
          for(var key in trans) {
            if(ignoreKeys.indexOf(key) === -1) {
              typeData.data[key] = trans[key];
            }
          }
        }

      });

    });
  };
};
