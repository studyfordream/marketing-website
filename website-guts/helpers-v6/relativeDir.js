module.exports = function relativeDir (thisDest, linkPath) {
  thisDest = thisDest.dirname;
  thisDest = thisDest.replace(process.cwd() + '/website', '');

  if(!!linkPath) {
    thisDest = linkPath + thisDest;
  }

  return thisDest;
};
