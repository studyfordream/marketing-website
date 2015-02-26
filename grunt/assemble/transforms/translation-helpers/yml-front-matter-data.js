var path = require('path');
var _ = require('lodash');
var matter = require('gray-matter');
var globby = require('globby');

module.exports = function(assemble) {

  return function(translationType, patterns, locale) {
    var langKeys = {
      modal: 'modals',
      layout: 'layouts'
    };
    var componentKey = langKeys[translationType];
    var key = langKeys[translationType];
    var langData = {};
    var frontMatterData = langData[componentKey] = {};
    //in this case the componentType is the path to the modals || layouts dir
    var componentPaths = globby.sync(patterns, {cwd: locale});

    componentPaths = componentPaths.reduce(function(map, cp) {
      var fp = path.join(locale, cp);
      return map.concat([fp]);
    }, []);

    componentPaths.forEach(function(cp) {
      var componentName;
      var componentData = {};
      var data = matter.read(cp).data;

      //if it's a modal || file the key is the filename
      componentName = path.basename(cp, '.hbs');
      //check if the modal exists in the root website dir
      if( !frontMatterData[componentName] ) {
        frontMatterData[componentName] = {};
        //use the whitelist to retrieve modal data
        _.forEach(data, function(val, key) {
          frontMatterData[componentName][key] = val;
        });

        if(Object.keys(frontMatterData[componentName]).length === 0) {
          delete frontMatterData[componentName];
        }

      }

    }); //end globby each loop

    return langData;
  };

};
