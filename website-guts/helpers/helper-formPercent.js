module.exports.register = function (Handlebars)  {
  Handlebars.registerHelper('formatPercentHeader', function (value, percentClass)  {
    var newHeader,
        startsWithPercent = /^[0-9]{1,3}%/,
        number,
        restOfHeader;

    if( startsWithPercent.test(value) ){
      number = value.match(/[0-9]*\.?[0-9]+%/)[0].replace('%', '');
      restOfHeader = value.split('% ')[1];

      newHeader = '<span>' + number + '</span><span class="' + percentClass + '"> % </span><h4 class="customer-title">' + restOfHeader + '</h4>';
    } else if( /\d+/.test(value) ) {
      number = value.match(/\d+/)[0];
      restOfHeader = value.split(number)[1];

      newHeader = '<span>' + number + ' </span><h4 class="customer-title">' + restOfHeader + '</h4>';
    } else {
      newHeader = '<h4 class="customer-title">' + value + '</h4>';
    }
    return newHeader;

  });
};
