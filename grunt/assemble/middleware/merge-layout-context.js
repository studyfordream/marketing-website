var createStack = require('layout-stack');
var extend = require('extend-shallow');

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
    //gets all of the data from each layout and extends the data object
    // page_success:
    //  { layout: 'wrapper',
    //    layout_script: false,
    //    layout_body_class: false,
    //    src:
    //     { dirname: 'website-guts/templates/layouts',
    //       basename: 'page_success.hbs',
    //       name: 'page_success',
    //       extname: '.hbs',
    //       extSegments: [Object],
    //       path: 'website-guts/templates/layouts/page_success.hbs',
    //       ext: '.hbs' },
    //    dest:
    //     { dirname: 'website-guts/templates/layouts',
    //       basename: 'page_success.hbs',
    //       name: 'page_success',
    //       extname: '.hbs',
    //       extSegments: [Object],
    //       path: 'website-guts/templates/layouts/page_success.hbs',
    //       ext: '.hbs' } 
    //     },
    /* jshint ignore:start */
    while (name = stack.shift()) {
      extend(data, layouts[name]);
    }
    /* jshint ignore:end */
    extend(data, file.data);

    //puts the data from the YAML front matter of layouts onto file.data
    //can be accessed with this[property] in hbs template
    //ex. this.body_class in the wrapper layout
    file.data = data;
    next();
  };
};