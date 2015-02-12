module.exports = function relativeDir (thisDest, linkPath) {
  var pathname;
  //pathname = thisDest.dirname;
  
  //if(/website\-/.test(pathname)) {
    //pathname = pathname.substr(pathname.indexOf('/'));
  //} else {
    //pathname = pathname.replace(process.cwd() + '/website', '');
  //}

  //if(!!linkPath) {
    //pathname = linkPath + pathname;
  //}
  //if (pathname[0] !== '/') {
    //pathname = '/' + pathname;
  //}

  pathname = thisDest.dirname.substr(thisDest.dirname.lastIndexOf('/') + 1);
  return pathname;
};
