module.exports = function tr(key) {
  var tr = require('l10n-tools/tr');
  var app = this.app;
  var dicts = app.get('dicts');
  var locale = this.context.locale || 'website';
  if (locale === 'website') {
    return key;
  }
  var dataKey = this.context.dataKey;
  var locales = app.get('data.locales');
  var dictKey = locales[locale];
  if (dicts[dictKey] && dicts[dictKey][dataKey]) {
    tr.setDict(dicts[dictKey][dataKey]);
  } else {
    tr.setDict({});
  }
  var translation = tr(key);
  // if key is not translated - try to do lookup in layout dictionary
  if(this.context.layouts) {
    var ii = 0;
    while(translation === key && ii < this.context.layouts.length) {
      var layout = this.context.layouts[ii];

      tr.setDict(dicts[dictKey][layout]);
      translation = tr(key);
      ii += 1;
    }
  }
  return translation;
};
