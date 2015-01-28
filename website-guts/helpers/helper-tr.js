
module.exports.register = function (Handlebars)  {
  Handlebars.registerHelper('tr', function () {
    // just a proxy to send request to window.optly.tr
    if(typeof window !== 'undefined') {
      return window.optly.tr.apply(null, arguments);
    } else {
      var tr = function(str) {
        var subs = [].slice.call(arguments, 1);
        if(subs.length > 0){
          // Convert message resource to string if we need to make a substitutions
          return str.toString().replace(/\\*{(\d+)}/g, function(match, number) {
            var slashes = match.substring(0, match.indexOf('{'));
            if(slashes.length === 1) {
              // single slash used to escape curly bracket
              return match.substr(1);
            }
            else if(typeof subs[number] === 'undefined') {
              return match;
            }
            return slashes + subs[number];
          });
        }
        return str;
      };
      return tr.apply(null, arguments);
    }
  });
};
