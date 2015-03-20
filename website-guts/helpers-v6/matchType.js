module.exports = function (type, dataType)  {
  var typeMatch = dataType.filter(function(typeO) {
    return typeO.name === type;
  })[0];

  return typeMatch.attr;
};
