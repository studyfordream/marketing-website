var tr = require('../assets/js/globals/translation.js');

module.exports.register = function (Handlebars)  {
  Handlebars.registerHelper('tr', function () {
    // just a proxy to send request to window.optly.tr
    return tr.apply(null, arguments);
  });
};
