module.exports = function (context)  {
  var types = this.app.get('resourceTypes');
  var type = types[context.rootKey];
  type = type.toLowerCase();

  return type;
};
