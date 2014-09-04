module.exports.register = function (Handlebars)  { 
  Handlebars.registerHelper('is_even', function (index, options)  {
    if ( index % 2 === 0 ) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
};
