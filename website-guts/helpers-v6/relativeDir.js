module.exports = function relativeDir (thisDest, linkPath) {
  var pathname;
  pathname = thisDest.dirname.substr(thisDest.dirname.lastIndexOf('/') + 1);
  return pathname;
};
