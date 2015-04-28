module.exports = function addLocalDict(options) {
  var app = this.app;
  var locales = app.get('data.locales');
  var assetsDir = app.get('data.assetsDir');
  var root = app.get('data.websiteRoot');
  var locale = this.context.locale;
  var dictKey = locales[locale];

  if(locales[locale]) {
    return options.fn({dictKey: dictKey});
  } else {
    return options.inverse(this);
  }

};
