// http://stackoverflow.com/questions/12331077/does-handlebars-js-replace-newline-characters-with-br

module.exports.register = function (Handlebars) {
  Handlebars.registerHelper('breaklines', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
  });
};
