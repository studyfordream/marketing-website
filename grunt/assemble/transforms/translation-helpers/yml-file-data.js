var path = require('path');
var extend = require('extend-shallow');
var _ = require('lodash');
var Plasma = require('plasma');

module.exports = function(patterns, locale, root) {
  var plasma = new Plasma();
  var iterator = 0;
  var keysCache = [];
  var pagesNamespace = 'page_data';
  var lastKey, data;
  var cwd = root ? root : locale;
  plasma.option('cwd', cwd);
  plasma.option('namespace', function(fp) {
    var key = path.join( path.dirname(fp), 'index').replace(process.cwd(), '');
    if(key[0] !== '/') {
      key = '/' + key;
    }

    if(keysCache.length && keysCache.indexOf(key) !== -1) {
      //intentionally use an obscure separator because the dash was clobbering file paths
      //with dashes in them
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
          extend(o[matched], data[key]);
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
