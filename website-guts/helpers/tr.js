module.exports = function _tr(key) {
  var tr = require('l10n-tools/tr');
  var app = this.app;
  var websiteRoot = app.get('data.websiteRoot');
  var isTest = app.get('env') === 'test';
  var dicts = app.get('dicts');
  var locale = this.context.locale || websiteRoot;
  if (locale === websiteRoot && !isTest) {
    return key;
  }
  var dataKey = this.context.dataKey;
  var locales = app.get('data.locales');
  var dictKey = isTest ? 'de_DE' : locales[locale];
  if (dicts[dictKey] && dicts[dictKey][dataKey]) {
    tr.setDict(dicts[dictKey][dataKey]);
  } else {
    tr.setDict({});
  }
  var translation = tr.apply(tr, arguments);
  // if key is not translated - try to do lookup in layout dictionary
  if(this.context.layouts) {
    var ii = 0;
    while(translation === key && ii < this.context.layouts.length) {
      var layout = this.context.layouts[ii];

      tr.setDict(dicts[dictKey][layout]);
      translation = tr.apply(tr, arguments);
      ii += 1;
    }
  }
  return translation;
};
