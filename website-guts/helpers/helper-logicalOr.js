module.exports.register = function (Handlebars)  {
  Handlebars.registerHelper('logicalOr', function(v1, v2, options) {
    if (v1 || v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
};
