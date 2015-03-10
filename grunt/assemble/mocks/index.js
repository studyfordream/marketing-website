var _ = require('lodash');

exports.logKeys = function logKeys(o) {
  console.log(Object.keys(o).sort(function(a,b) {
    if(a > b) {
      return 1;
    }
    if(a < b) {
      return -1;
    }
  }));
};

function recurseKeys(data) {
  return Object.keys(data).reduce(function(o, key) {
    var val, clone;

    if(_.isPlainObject(data[key])) {
      o[key] = recurseKeys(data[key]);
    } else if(Array.isArray(data[key])) {
      data[key].forEach(function(thing, index) {
        if(_.isPlainObject(thing)) {
          for(var propKey in thing) {
            thing[propKey] += ' I GOT TRANSLATED';
          }
        } else {
          o[key][index] = thing + ' I GOT TRANSLATED';
        }
      });
    } else {
      o[key] = data[key] + ' I GOT TRANSLATED';
    }

    return o;

  }, _.clone(data));
}
// var smartling = require('smartling-api');
exports.smartling = {
  upload: function (dictionary, done) {
    //languages['website-de'] = {
      //about: {
        //seo_title: 'New Stuff',
        //visible_title: 'New Stuff'
      //}
    //};
    var translated = recurseKeys(dictionary);
    done(null, translated);
  }
};
