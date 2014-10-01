module.exports.register = function (Handlebars) {
  Handlebars.registerHelper('relativeDir', function(thisDest, linkPath) {
    thisDest = thisDest.substr(0, thisDest.lastIndexOf('/') + 1).replace('dist', '');

    if(!!linkPath) {
      console.log(linkPath);
      thisDest = linkPath + thisDest;
    }

    return thisDest;
  });
};
