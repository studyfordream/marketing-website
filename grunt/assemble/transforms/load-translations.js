'use strict';

/**
 * args =>
 *  0 => name
 *  1 => transform
 *  2 => patterns
 *  3 => locale
 */

//method scopes page data from YML file in same directory onto the `lang` object
//must remember to account for YML data that is intended to be global
module.exports = function translationTransform (assemble, args) {
  var path = require('path');
  var globby = require('globby');
  var _ = require('lodash');
  var matter = require('gray-matter');
  var extend = require('extend-shallow');
  var lang = assemble.get('lang') || {};
  var translationType = args[0];
  var patterns = args[2];
  var locale = args[3];
  var Plasma = require('plasma');
  var modalWhitelist = assemble.get('data.modalYamlWhitelist');
  var modalsKey = 'modals';
  var websiteRoot = assemble.get('data.websiteRoot');
  var plasma, data, modalPaths;

  patterns = Array.isArray(patterns) ? patterns : [patterns];

  if( /page/.test(translationType) || /subfolder/.test(translationType) ) {
    plasma = new Plasma();
    plasma.option('cwd', locale);
    var iterator = 0;
    var keysCache = [];
    var lastKey;
    plasma.option('namespace', function(fp) {
      var key = path.dirname(fp).split('/').slice(-1)[0];
      //for consitency with translation plugin root hompage key is `index`
      if(locale.indexOf(key) !== -1) {
        //if we want to make root YAML global should do it here
        key = 'index';
      }

      if(keysCache.length && keysCache.indexOf(key) !== -1) {
        key = key + '-' + iterator;
        iterator += 1;
      } else {
        keysCache.push(key);
      }
      //namespace to the file name
      return key;
    });

    data = plasma.load(patterns);

    //plasma overwrites the same keys data so this will extend it
    if(iterator > 0) {
      data = Object.keys(data).reduce(function(o, key) {
        var matched, re;
        if(lastKey && key.indexOf('-') !== -1) {
          matched = key.split('-')[0];
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

    // add logic for pulling out whitelisted TR and MD strings
    // this transorm fetches all of the YML data in the files same directory
    // would have to add some sort of whitelist/blacklist here for scoping some of the YML company data globally
    // how will we later reference this data in templates, assuming with keyword `this`
    lang[locale] = extend({}, lang[locale], data);
  } else if( /modal/.test(translationType) ) {
    modalPaths = globby.sync(patterns, {cwd: locale});

    modalPaths = modalPaths.reduce(function(map, modalPath) {
      var fp = path.join(locale, modalPath);
      return map.concat([fp]);
    }, []);

    modalPaths.forEach(function(modalPath) {
      var modalName, modalData;
      data = matter.read(modalPath).data;

      if(!lang[modalsKey]) {
        lang[modalsKey] = {};
      }
      //if it's a modal file the key is the filename
      modalName = path.basename(modalPath, '.hbs');
      //check if the modal exists in the root website dir
      if( !lang[modalsKey][modalName] ) {
        modalData = lang[modalsKey][modalName] = {};
        //use the whitelist to retrieve modal data
        _.forEach(data, function(val, key) {
          if(modalWhitelist.indexOf(key) !== -1) {
            modalData[key] = val;
          }
        });

      }

    }); //end globby each loop

  }

  assemble.set('lang', lang);
};
