module.exports = function (context)  {
  var lang = this.app.get('lang');
  var websiteRoot = this.app.get('data.websiteRoot');
  var locale = this.context.locale;
  var type;
  if(locale !== websiteRoot) {
    type = lang[websiteRoot][context.rootKey].TR_type;
  } else {
    type = this.type;
  }
  type = type.toLowerCase();

  return type;
};
