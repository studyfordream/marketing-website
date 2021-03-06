'use strict';
var extend = require('extend-shallow');

module.exports = function(assemble, websiteRoot) {

  return function (type) {
    return function (key, locals, options, next) {
      var isTest = assemble.get('env');
      var app = this.app;

      if (typeof options === 'function') {
        next = options;
        options = locals;
      }
      var locale = this.context.locale || websiteRoot;

      if (isTest === 'test' || locale !== websiteRoot) {
        key = locale + '_' + key;
      }
      var partial = app.views[type][key];

      if (!partial) {
        // TODO: use actual delimiters in messages
        console.error(type + ' {{"' + key + '"}} not found.');
        return next(null, '');
      }

      var locs = extend({}, this.context, locals);
      partial.render(locs, function (err, content) {
        if (err) {
          return next(err);
        }
        next(null, content);
        return;
      });
    };
  };
};
