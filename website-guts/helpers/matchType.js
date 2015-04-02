module.exports = function (context)  {
  var websiteRoot = this.app.get('data.websiteRoot');
  var types = this.app.get('resourceTypes');
  var locale = this.context.locale;
  var type = types[context.rootKey];
  type = type.toLowerCase();

  return type;
};
