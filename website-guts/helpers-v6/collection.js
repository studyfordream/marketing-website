module.exports = function collection (name, options) {
  var app = this.app;
  var context = this.context;
  var col = app.get(name);
  var html = '';
  var keys = Object.keys(col);
  html = keys.map(function (key) {
    return options.fn(col[key]);
  }).join('\n');
  return html;
};
