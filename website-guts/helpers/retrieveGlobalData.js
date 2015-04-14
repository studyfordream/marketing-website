module.exports = function retrieveGlobalData (name, options) {
  var app = this.app;
  var col = app.get(name);
  var html = options.fn(col);
  return html;
};
