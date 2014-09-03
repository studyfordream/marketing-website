module.exports.register = function (Handlebars)  { 
  Handlebars.registerHelper('is_odd', function (index, options)  {
    if ( index % 2 !== 0 ) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
};
