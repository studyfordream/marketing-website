var marked = require('optimizely-marked');
module.exports.register = function (Handlebars)  {
  Handlebars.registerHelper('omarkdown', function (options)  {
    marked.setOptions({
      linkPath: options.hash.path,
      smartypants: true
    });
    return marked(options.fn(this));
  });
};
