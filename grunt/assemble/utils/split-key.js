module.exports = function splitKey(str) {
  var split;

  if( /^(MD|TR|HTML)_/.test(str) ) {
    split = str.split(/_(.+)?/);

    split = split.filter(function(item) {
      if(!!item) {
        return item;
      }
    });
  }
  return split || str;
};
