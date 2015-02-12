module.exports = function relativeDir (thisDest, linkPath) {
  var pathname;
  console.log('this object', thisDest);
  console.log('****link path****', linkPath);
  pathname = thisDest.dirname;
  
  if(/website\-/.test(pathname)) {
    pathname = pathname.substr(pathname.indexOf('/'));
  } else {
    pathname = pathname.replace(process.cwd() + '/website', '');
  }

  if(!!linkPath) {
    pathname = linkPath + pathname;
  }
  if (pathname[0] !== '/') {
    pathname = '/' + pathname;
  }

  return pathname;
};
