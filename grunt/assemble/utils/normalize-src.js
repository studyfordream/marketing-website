var path = require('path');

//concat for current working directory and append the bang if necessary
module.exports = function normalizeSrc (cwd, sources) {
  sources = Array.isArray(sources) ? sources : [sources];
  return sources.map(function (src) {
    if (src[0] === '!') {
      return path.join('!' + cwd, src.substring(1));
    }
    return path.join(cwd, src);
  });
};
