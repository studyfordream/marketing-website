'use strict';

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var through = require('through2');
var extend = require('extend-shallow');
var htmlParser = require('l10n-tools/html-parser');
var smartling = require('l10n-tools/smartling');
var objParser = require('l10n-tools/object-extractor');
var fs = require('fs');
var q = require('q');
var crypto = require('crypto');
var smartlingConfig;

try{
  smartlingConfig = fs.readFileSync(path.join(process.cwd(), 'configs/smartlingConfig.json'), {encoding: 'utf8'});
} catch(err){
  console.error('Cannot read Smartling config: ', err);
}
if(smartlingConfig){
  smartlingConfig = JSON.parse(smartlingConfig);
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

    _.forEach(lang, function(pages){
      _.forEach(pages, function(fileInfo, fname){
        var list = objParser.extract(fileInfo);
        phrases.push({fname: fname, phrases: list});
      });
    });

    var content = smartling.generatePO(phrases);
    var hash = crypto.createHash('sha1');
    hash.setEncoding('hex');
    hash.write(content);
    hash.end();
    var newSum = hash.read();

    var latestSum = null;
    if(fs.existsSync('tmp/upload/' + DICT_FNAME)){
      // now compare with latest uploaded catalogue checksum
      hash = crypto.createHash('sha1');
      hash.setEncoding('hex');
      hash.write(fs.readFileSync('tmp/upload/' + DICT_FNAME, {encoding: 'UTF8'}));
      hash.end();
      latestSum = hash.read();
    }
    if(newSum === latestSum){
      console.log('Master catalog didn\'t since last upload - using cached dictionaries.');
      var translations = {};
      localeCodes.map(function(code){
        var body = fs.readFileSync('tmp/download/' + code + '-' + DICT_FNAME, {encoding: 'UTF8'});
        translations[code] = smartling.parsePOWithContext(body);
      });
      assemble.set('dicts', translations);
      cb();
    } else {
      mkdirp.sync('tmp/upload');
      mkdirp.sync('tmp/download');
      fs.writeFile('tmp/upload/' + DICT_FNAME, content);
      smartling.send(content, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID, DICT_FNAME).then(function(){
        var translations = {};
        var defers = localeCodes.map(function(code){
          return smartling.fetch(smartlingConfig.URL, code, DICT_FNAME, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID).then(function(body){
            fs.writeFile('tmp/download/' + code + '-' + DICT_FNAME, body);
            translations[code] = smartling.parsePOWithContext(body);
          });
        });

        // when all translations are fetched - call callback
        q.all(defers).then(function(){
          assemble.set('dicts', translations);
          cb();
        });
      });
    }

  });
};
