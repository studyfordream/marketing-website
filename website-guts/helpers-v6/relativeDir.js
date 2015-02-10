module.exports = function relativeDir (thisDest, linkPath) {
  thisDest = thisDest.dirname;
  thisDest = thisDest.replace(process.cwd() + '/website', '');

  if(!!linkPath) {
    var locale = linkPath.substr(1).split('/')[1];
    var index = locale == undefined ? -1 : thisDest.indexOf(locale);
    if (index !== -1) {
      thisDest = thisDest.substring(index + locale.length);
    }
    thisDest = linkPath + thisDest;
  }
  if (thisDest[0] !== '/') {
    thisDest = '/' + thisDest;
  }

  return thisDest;
};
