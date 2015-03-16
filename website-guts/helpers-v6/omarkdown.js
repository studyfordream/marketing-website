var marked = require('optimizely-marked');
var extend = require('extend-shallow');

module.exports = function omarkdown (options)  {
  marked.setOptions({
    linkPath: this.context.linkPath,
    smartypants: true
  });
  return marked(options.fn(this.context));
};
