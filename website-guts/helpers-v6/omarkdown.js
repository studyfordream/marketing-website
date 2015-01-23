var marked = require('optimizely-marked');
module.exports = function omarkdown (options)  {
  marked.setOptions({
    linkPath: options.hash.path,
    smartypants: true
  });
  return marked(options.fn(this));
};
