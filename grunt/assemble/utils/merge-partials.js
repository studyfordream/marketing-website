'use strict';

var extend = require('extend-shallow');
var cloneDeep = require('clone-deep');
var pickFrom = require('pick-from');

module.exports = function mergePartials (context) {
  // locals = merge({}, context, locals);

  // if (this.get('merged-partials-context')) {
  //   return this.get('merged-partials-context');
  // }

  var opts = context.options || {};
  opts.partials = cloneDeep(context.partials || {});

  var arr = this.type.partial;
  var len = arr.length, i = 0;

  // loop over each `partial` collection (e.g. `docs`)
  while (len--) {
    var plural = arr[i++];
    // Example `this.views.docs`
    var collection = this.views[plural];
    var mergeTypeContext = this.mergeTypeContext.bind(this, 'partials');

    // Loop over each partial in the collection
    for (var key in collection) {
      if (collection.hasOwnProperty(key)) {
        var value = collection[key];

        mergeTypeContext(key, value.locals, value.data);

        // get the globally stored context that we just created
        // using `mergeTypeContext` for the current partial
        var layoutOpts = this.cache._context.partials[key];
        layoutOpts.layoutDelims = pickFrom('layoutDelims', [layoutOpts, opts]);

        // wrap the partial with a layout, if applicable
        value.content = this.applyLayout(value, layoutOpts);
        // If `mergePartials` is true combine all `partial` subtypes
        if (mergePartials === true) {
          opts.partials[key] = value.content;

        // Otherwise, each partial subtype on a separate object
        } else {
          opts[plural] = opts[plural] || {};
          opts[plural][key] = value.content;
        }
      }
    }
  }
  context.options = extend({}, context.options, opts);
  // this.set('merged-partials-context', context);
  return context;
};
