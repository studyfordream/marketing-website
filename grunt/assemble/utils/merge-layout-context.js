var path = require('path');
var createStack = require('layout-stack');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');
var splitKey = require('../utils/split-key');
var extendWhile = require('../utils/extend-while');

module.exports = function(assemble) {
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var generateKey = require('../utils/generate-key');

  // transform the layout front matter into an object
  // that `layout-stack` requires
  var mapLayouts = function (layouts) {
    return Object.keys(layouts).reduce(function (acc, key) {
      acc[key] = layouts[key].data;
      return acc;
    }, {});
  };

  // middleware to merge the layout context into the current page context
  return function mergeLayoutContext (file) {
    var isTest = assemble.get('env');
    var translated = assemble.get('translated');
    var locales = assemble.get('data.locales');
    var filePathData = parseFilePath(file.path);
    var locale = filePathData.locale;
    var dictKey = locales[locale];
    var dataKey = 'layouts';
    var dicts = assemble.get('dicts');
    if(isTest === 'test') {
      dictKey = 'de_DE';
    }

    //the layout for the current file
    var layout = file.layout || file.options.layout || file.data.layout;
    // => partners
    //all of the layouts on assemble normalized with a key of layout name
    //value of YAML front matter for layout and SRC and DEST mappings
    var layouts = mapLayouts(assemble.views.layouts);
    // => layout frontmatter

    //stack is an array of layout mappings, i.e. => ['wrapper', 'partners']
    var stack = createStack(layout, layouts, assemble.options);

    var data = {};
    var name = null;
    var page, dict;
    var ignoreKeys = [
      'src',
      'dest',
      'layout'
    ];
    /* jshint ignore:start */
    while (name = stack.shift()) {
      //get the dictionary key represented by the file path
      page = generateKey(layouts[name].src.path);

      _.forEach(layouts[name], function(val, key) {
        //here swap the keys
        if(ignoreKeys.indexOf(key) === -1) {
          var split = splitKey(key);

          if(Array.isArray(split)) {
            data[split[1]] = val;
            delete data[key];
          } else {
            data[key] = val;
          }
        }

      });

      //only do translation if not the om/ppc directory
      if(!file.data.isPpc && filePathData.isSubfolder || (filePathData.isRoot && isTest === 'test')) {
        translations = translated[dictKey] && translated[dictKey][page];

        //append layouts paths on context for tr handlebars helper
        //and translate layout YFM
        file.data.layouts = file.data.layouts || [];
        file.data.layouts.push(page);
        if(translations) {
          extendWhile(data, translations);
        }
      }
    }

    /* jshint ignore:end */
    //non mutating merge is important here because translation keys were being mutated
    //may only see this problem in subfolders
    extendWhile(file.data, data);

    //if(file.data.layout === 'about') {
      ////console.log(file.data);
    //}
  };
};
