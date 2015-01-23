module.exports = function relativeDir (thisDest, linkPath) {
  thisDest = thisDest.substr(0, thisDest.lastIndexOf('/') + 1).replace('dist', '');

  if(!!linkPath) {
    thisDest = linkPath + thisDest;
  }

  return thisDest;
};
