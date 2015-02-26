var path = require('path');
var extend = require('extend-shallow');
var _ = require('lodash');
var Plasma = require('plasma');

module.exports = function(patterns, locale) {
  var plasma = new Plasma();
  var iterator = 0;
  var keysCache = [];
  var pagesNamespace = 'page_content';
  var lastKey, data;
  plasma.option('cwd', locale);
  plasma.option('namespace', function(fp) {
    var key = path.dirname(fp).split('/').slice(-1)[0];
    //for consitency with translation plugin root hompage key is `index`
    if(locale.indexOf(key) !== -1) {
      //if we want to make root YAML global should do it here
      key = 'index';
    }

    if(keysCache.length && keysCache.indexOf(key) !== -1) {
      key = key + '~' + iterator;
      iterator += 1;
    } else {
      keysCache.push(key);
    }
    //namespace to the file name
    return key;
  });

  data = plasma.load(patterns);
  //!!!TODO: need to adjust logic here to account for nested dirs
  //my method below is actually overwriting YML data for nested pages
  //plasma overwrites the same keys data so this will extend it
  if(iterator > 0) {
    data = Object.keys(data).reduce(function(o, key) {
      var matched, re;
      if(lastKey && key.indexOf('~') !== -1) {
        matched = key.split('~')[0];
        re = new RegExp(lastKey);

        if( re.test(matched) ) {
          o[matched] = extend(o[matched], data[key]);
          delete data[key];
        }
      } else {
        o[key] = data[key];
      }

      lastKey = key;
      return o;
    }, {});
  }
  //create the namespace for page data
  data = Object.keys(data).reduce(function(o, key) {
    o[key] = {};
    o[key][pagesNamespace] = data[key];
    return o;
  }, {});

  return data;
};
