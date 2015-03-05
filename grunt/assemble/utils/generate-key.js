var path = require('path');

module.exports = function(fp) {
  var key = path.join( path.dirname(fp), 'index').replace(process.cwd(), '');
  if(key[0] !== '/') {
    key = '/' + key;
  }

  return key;
};
