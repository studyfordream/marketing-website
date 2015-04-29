var _ = require('lodash');
var path = require('path');
var types = [
  'partials',
  'modals'
];

module.exports = function(assemble) {
  var websiteGuts = assemble.get('data.websiteGuts');
  var locales = assemble.get('data.locales');
  var views = assemble.views;

  return function translateAssembleViews(translated) {
    types.forEach(function(type) {
      var view = views[type];

      _.forEach(view, function(typeData, typeName) {
        var split = typeName.split('_');
        var localePrefix = split.shift();
        var dictKey = locales[localePrefix];
        var typePath, restructuredName, trans;
        if(dictKey) {
          restructuredName = split.join('_');
          typePath = '/' + path.join(websiteGuts, 'templates', type, restructuredName);
          trans = ( translated[dictKey] && translated[dictKey][typePath] ) || {};
          if(trans.page_content) {
            typeData.content = trans.page_content;
          }
        }

      });

    });
  };
};
