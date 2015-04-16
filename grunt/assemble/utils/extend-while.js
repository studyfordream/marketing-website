module.exports = function(target, src) {
  var keys = Object.keys(src);
  var len = keys.length;
  var i = 0;
  //extend the file data YFM with layout YFM
  while (len--) {
    var key = keys[i++];
    var val = src[key];
    target[key] = val;
  }
};
