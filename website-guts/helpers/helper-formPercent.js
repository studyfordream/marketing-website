module.exports.register = function (Handlebars)  {
  Handlebars.registerHelper('formatPercentHeader', function (value, percentClass)  {
    var startsWithPercent,
        newHeader;
    startsWithPercent = /^[0-9]{1,3}%/;

    if( startsWithPercent.test(value) ){
      var number,
          restOfHeader;
      number = value.match(/^[0-9]{1,3}/);
      restOfHeader = value.split('% ')[1];
      newHeader = '<span>' + number + '</span><span class="' + percentClass + '"> % </span><h4 class="customer-title">' + restOfHeader + '</h4>';
      return newHeader;
    } else {
      newHeader = '<h4 class="customer-title">' + value + '</h4>';
      return newHeader;
    }
  });
};
