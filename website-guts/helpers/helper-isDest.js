var path = require('path');

module.exports.register = function (Handlebars) {
  Handlebars.registerHelper('isDest', function(dest, compare, insertTrue, insertFalse, linkPath) {
    var base = path.dirname(dest);
    base = base.substr(base.lastIndexOf('/') + 1);
    
    if(base === compare){
       return insertTrue;
    } else if (insertFalse && linkPath) {
       return path.join(linkPath, insertFalse);
    } else {
      return '';
    }
  });
};