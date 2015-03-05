'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var through = require('through2');
var extend = require('extend-shallow');
var htmlParser = require('l10n-tools/html-parser');
var smartling = require('l10n-tools/smartling');
var fs = require('fs');
var q = require('q');
var smartlingConfig;
var i = 1;

try{
  smartlingConfig = fs.readFileSync(path.join(process.cwd(), 'configs/smartlingConfig.json'), {encoding: 'utf8'});
} catch(err){
  console.error('Cannot read Smartling config: ', err);
}
if(smartlingConfig){
  smartlingConfig = JSON.parse(smartlingConfig);
}

function isIndex(fp, testStr) {
  if(fp[0] !== '/') {
    fp = '/' + fp;
  }
  return fp.indexOf('/' + testStr + '/') !== -1;
}


module.exports = function (assemble) {
  var lang = assemble.get('lang') || {};
  var pageData = assemble.get('pageData');
  var environment = assemble.option('environment');
  var websiteRoot = assemble.get('data.websiteRoot');
  var locales = assemble.get('data.locales');
  var localeCodes = Object.keys(locales).map(function(subfolder) {
    return locales[subfolder];
  });
  var createTranslationDict = require('../utils/create-dictionary')(assemble);
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var locale, dictKey, dataKey;

  return through.obj(function (file, enc, cb) {
    // instead of middleware
    // load file.data information onto `assemble.get('lang')` here
    var data,parsedTranslations, filePathData, locale;

    //here were merge the file data with local YML data
    filePathData = parseFilePath(file.path);
    locale = filePathData.locale;
    dataKey = filePathData.dataKey;

    parsedTranslations = createTranslationDict(file, locale);

    if(Object.keys(parsedTranslations).length > 0) {
      lang[locale] = lang[locale] || {};
      lang[locale][dataKey] = extend({}, lang[locale][dataKey], parsedTranslations);
    }

    this.push(file);
    cb();
  }, function (cb) {
    assemble.set('lang', lang);
    var DICT_FNAME = 'marketing_website_yaml.pot';
    var phrases = [];

    // if(environment === 'dev') {
    //   assemble.set('translated', lang);
    //   cb();
    // } else if(environment === 'smartling-staging') {

    // }
    /*
      Recursively go aroung object and group all of the text messages by filename
     */
    function addStrings(phrases, obj, key){
      if(_.isString(obj)){

        if(key.indexOf('MD_') === 0){
          // parse given key as HTML page - try to extract simple messages from it
          var list = htmlParser.extract(obj);
          // append all the new messages into general array
          phrases.push.apply(phrases, list);
        } else {
          phrases.push({msg: obj});
        }

      } else if (_.isArray(obj) || _.isPlainObject(obj)) {
        _.forEach(obj, function(value, key){
          addStrings(phrases, value, key);
        });
      }
    }


    _.forEach(lang, function(pages){
      _.forEach(pages, function(keys, fname){
        var list = [];
        phrases.push({fname: fname, phrases: list});
        addStrings(list, keys, fname);
      });
    });

    //console.log('send to smartling', phrases);

    smartling.send(smartling.generatePO(phrases), smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID, DICT_FNAME).then(function(){
      var translations = {};
      var defers = localeCodes.map(function(code){
        return smartling.fetch(smartlingConfig.URL, code, DICT_FNAME, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID).then(function(body){
          //fs.writeFileSync(code + '-' + DICT_FNAME, body);
          //console.log(smartling.parsePOWithContext(body));
          translations[code] = smartling.parsePOWithContext(body);
        });
      });

      // when all translations are fetched - call callback
      q.all(defers).then(function(){
        assemble.set('translated', translations);
        cb();
      });
    });

  });
};
