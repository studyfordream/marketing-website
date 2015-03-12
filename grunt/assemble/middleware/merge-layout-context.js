var path = require('path');
var createStack = require('layout-stack');
var extend = require('extend-shallow');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');

//var mergeTranslated = require('../utils/merge-tranlated-dictionary');

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
  return function mergeLayoutContext (file, next) {
    var isTest = assemble.get('env');
    var lang = assemble.get('lang');
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
    var page;
    var dict;
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
          data[key] = val;
        }

      });

      dict = dicts[dictKey] && dicts[dictKey][page];

      //append layouts paths on context for tr handlebars helper
      //and translate layout YFM
      if(filePathData.isSubfolder || (filePathData.isRoot && isTest === 'test')) {
        file.data.layouts = file.data.layouts || {};
        file.data.layouts[name] = page;
        if(dict) {
          objParser.translate(data, dict);
        }
      }

    }

    /* jshint ignore:end */
    //which way should extend be to overwrite file.data with data
    //data from layout YFM would overwrite page YFM if the keys match
    extend(file.data, data);

    //puts the data from the YAML front matter of layouts onto file.data
    //can be accessed with this[property] in hbs template
    //ex. this.body_class in the wrapper layout
    //file.data = data;
    next();
  };
};
