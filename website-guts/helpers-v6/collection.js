var _ = require('lodash');

module.exports = function collection (name, options) {
  //get the collection object off of the assemble instance
  //template the data into the hbs and join the strings
  //sort the collection order by the priority key
  var app = this.app;
  var col = app.get(name);
  var collectionData = Object.keys(col).map(function (key) {
    return col[key];
  });
  var html = _.sortBy(collectionData, 'priority').map(function(data) {
    return options.fn(data);
  }).join('\n');
  return html;
};
