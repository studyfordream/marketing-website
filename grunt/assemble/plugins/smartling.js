'use strict';

var path = require('path');
var through = require('through2');
var extend = require('extend-shallow');

// var smartling = require('smartling-api');
var smartling = {
  upload: function (languages, done) {
    done(null, languages);
  }
};

module.exports = function (assemble) {
  var lang = assemble.get('lang');



  return through.obj(function (file, enc, cb) {
    // instead of middleware
    // load file.data information onto `assemble.get('lang')` here

    // normalize key
    var key = path.dirname(file.path);
    var index = key.indexOf('/website');
    if ( index !== -1) {
      key = key.substr(index + 1);
    }

    // find the locale
    var locale = key.split('/')[0];

    // find the page name
    var page = key.split('/').slice(-1)[0];

    lang[locale] = lang[locale] || {};

    // add any page data
    lang[locale][page] = extend({}, lang[locale][page], file.data);

    this.push(file);
    cb();
  }, function (cb) {
    console.log('send to smartling');
    console.log(lang);
    smartling.upload(lang, function (err, translated) {
      if (err) {
        return cb(err);
      }
      assemble.set('lang', translated);
      cb();
    });
  });
};
