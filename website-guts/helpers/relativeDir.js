module.exports = function relativeDir (thisDest) {
  var pathname;
  pathname = thisDest.dirname.substr(thisDest.dirname.lastIndexOf('/') + 1);
  return pathname;
};
