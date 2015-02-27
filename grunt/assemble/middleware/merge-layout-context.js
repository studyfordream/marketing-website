var path = require('path');
var createStack = require('layout-stack');
var extend = require('extend-shallow');
var _ = require('lodash');

module.exports = function(assemble) {
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
    var translated = assemble.get('translated');
    var locale = 'layouts';
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
    /* jshint ignore:start */
    while (name = stack.shift()) {
      _.forEach(layouts[name], function(val, key) {
        page = path.join(locale, name);
        //here swap the keys
        if(key !== 'src' && key !== 'dest') {
          //apply translation for the layout YFM
          if(translated[locale] && translated[locale][page] && translated[locale][page].hasOwnProperty(key)) {
            val = extend(val, translated[locale][page][key]);
          }

          data[key] = val;
        }

      });
    }

    /* jshint ignore:end */
    //which way should extend be to overwrite file.data with data
    file.data = extend(data, file.data);

    //puts the data from the YAML front matter of layouts onto file.data
    //can be accessed with this[property] in hbs template
    //ex. this.body_class in the wrapper layout
    //file.data = data;
    next();
  };
};