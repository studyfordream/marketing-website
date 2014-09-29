module.exports.register = function (Handlebars) {
  Handlebars.registerHelper('relativeDir', function(pageDest, thisDest) {
    thisDest = thisDest.substr(0, thisDest.lastIndexOf('/') + 1);
    pageDest = pageDest.substr(0, pageDest.lastIndexOf('/') + 1);

    return thisDest.replace(pageDest, '');
  });
};