'use strict';

var path = require('path');
var _ = require('lodash');
var through = require('through2');
var extend = require('extend-shallow');
var logKeys = function(o) {
  console.log(Object.keys(o).sort(function(a,b) {
    if(a > b) { 
      return 1;
    }
    if(a < b) { 
      return -1;
    }
  }));
};
// var smartling = require('smartling-api');
var smartling = {
  upload: function (languages, done) {
    languages['website-de'] = {
      about: {
        seo_title: 'New Stuff',
        visible_title: 'New Stuff'
      }
    };
    done(null, languages);
  }
};
var i = 1;
module.exports = function (assemble) {
  var lang = assemble.get('lang') || {};
  var environment = assemble.option('environment');
  var websiteRoot = assemble.get('data.websiteRoot');
  var locales = assemble.get('data.locales');
  var locale;

  return through.obj(function (file, enc, cb) {
    // instead of middleware
    // load file.data information onto `assemble.get('lang')` here
    var page, data, modalData;
    var rootIndex = file.path.indexOf('/' + websiteRoot + '/');
    var localeIndex = _.findIndex(locales, function(locale) {
      var re = new RegExp(locale);
      return re.test(file.path);
    });

    // pageData.about

    // normalize key
    if(rootIndex !== -1) {
      locale = websiteRoot;
    } else if(localeIndex !== -1) {
      locale = locales[localeIndex];
    }

    lang[locale] = lang[locale] || {};

    //if it's a page file other than the root homepage the path is the dirname
    page = path.dirname(file.path).split('/').slice(-1)[0];

    //if the page is the root homepage normalize it's key to `index`
    var allRoots = locales.concat(websiteRoot);
    if(allRoots.indexOf(page) !== -1) {
      page = path.basename(file.path, '.hbs');
    }

    // add any page data
    lang[locale][page] = extend({}, lang[locale][page], file.data);

    this.push(file);
    cb();
  }, function (cb) {
    //don't forget that lang.modals is defined here
    console.log('send to smartling');
    if(environment === 'dev') {
      //potentially have a cached translated object somewhere
      assemble.set('translated', lang);
      cb();
    }
    else if(environment === 'smartling-staging') {
      smartling.upload(lang, function (err, translated) {
        if (err) {
          return cb(err);
        }
        //console.log(Object.keys(lang.website));
        //logKeys(translated[locale]);
        assemble.set('translated', translated);
        cb();
      });
    } else if (environment === 'production' || environment === 'staging') {
      //retrieve translated object from smartling or potentially have a cached object somewhere
      console.log('environment is: ' + environment);
      cb();
    }
  });
};
