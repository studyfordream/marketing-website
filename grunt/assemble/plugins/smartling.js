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
var glob = require('glob');
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

var jsParser = require('l10n-tools/js-parser');
var hbsParser = require('l10n-tools/hbs-parser');
var smartling = require('l10n-tools/smartling');
var Q = require('q');
var fs = require('fs');

try{
  var smartlingConfig = fs.readFileSync('./configs/smartlingConfig.json', {encoding: 'utf-8'});
} catch(err){
  console.error('Cannot read Smartling config: ', err);
}
if(smartlingConfig){
  smartlingConfig = JSON.parse(smartlingConfig);
}


function checksumChanged(content, fname){
  var hash = crypto.createHash('md5');
  hash.setEncoding('hex');
  hash.write(content);
  hash.end();
  var newSum = hash.read();

  var latestSum = null;
  if(fs.existsSync(fname))
  {
    // now compare with latest uploaded catalogue checksum
    hash = crypto.createHash('md5');
    hash.setEncoding('hex');
    hash.write(fs.readFileSync(fname, {encoding: 'UTF8'}));
    hash.end();
    latestSum = hash.read();
  }
  return newSum === latestSum;
}

module.exports = function (assemble) {
  var lang = assemble.get('lang') || {};
  var pageData = assemble.get('pageData');
  var environment = assemble.option('environment');
  var websiteRoot = assemble.get('data.websiteRoot');
  var websiteGuts = assemble.get('data.websiteGuts');
  var locales = assemble.get('data.locales');
  var localeCodes = Object.keys(locales).map(function(subfolder) {
    return locales[subfolder];
  });
  var createTranslationDict = require('../utils/create-dictionary')(assemble);
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var generateKey = require('../utils/generate-key');
  var phrases = [];

  return through.obj(function (file, enc, cb) {
    // instead of middleware
    // load file.data information onto `assemble.get('lang')` here
    var data,parsedTranslations, filePathData, locale, pagePhrases;

    //here were merge the file data with local YML data
    filePathData = parseFilePath(file.path);
    locale = filePathData.locale;
    var dataKey = filePathData.dataKey;

    //create lang dictionary from TR prefixes
    parsedTranslations = createTranslationDict(file, locale);

    //parse file contents for tr helper phrases
    if(!file.HTML_page_content && file.contents) {
      pagePhrases = hbsParser.extract(file.contents.toString());
      if(pagePhrases.length) {
        phrases.push({
          fname: dataKey,
          phrases: pagePhrases
        });
      }
    }

    if(Object.keys(parsedTranslations).length > 0) {
      lang[locale] = lang[locale] || {};
      lang[locale][dataKey] = extend({}, lang[locale][dataKey], parsedTranslations);
    }

    this.push(file);
    cb();
  }, function (cb) {
    assemble.set('lang', lang);
    var DICT_FNAME = 'marketing_website_yaml.pot';
    var JS_DICT_FNAME = 'marketing_website_js.pot';

    _.forEach(lang, function(pages){
      _.forEach(pages, function(fileInfo, fname){
        var list = objParser.extract(fileInfo);
        phrases.push({fname: fname, phrases: list});
      });
    });

    function extractFrom(srcs, parser){
      return glob.sync(srcs).map(function (fname) {
        var phrases = parser.extract(fs.readFileSync(fname));
        return {
          fname: generateKey(fname),
          phrases: phrases
        };
      });
    }

    mkdirp.sync('tmp/upload');
    mkdirp.sync('tmp/download');
    mkdirp.sync('dist/assets/js');

    var clientHbsPhrases = extractFrom(path.join(websiteGuts, 'templates/client/**/*.hbs'), hbsParser);
    phrases = phrases.concat(clientHbsPhrases);
    var content = smartling.generatePO(phrases);
    var yamlDefer = Q.defer();
    if(checksumChanged(content, 'tmp/upload/' + DICT_FNAME)){
      console.log('Master catalog didn\'t since last upload - using cached dictionaries.');
      var translations = {};
      localeCodes.map(function(code){
        var body = fs.readFileSync('tmp/download/' + code + '-' + DICT_FNAME, {encoding: 'UTF8'});
        translations[code] = smartling.parsePOWithContext(body);
      });
      assemble.set('dicts', translations);
      yamlDefer.resolve();
    } else {
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
          yamlDefer.resolve();
        });
      });
    }

    var jsPhrases = extractFrom('website-guts/assets/js/**/*.js', jsParser);
    content = smartling.generatePO(jsPhrases);
    var jsDefer = Q.defer();
    function deployJSDict(locale, body) {
      var dict = smartling.parsePO2dict(body);
      content = 'window.optlyDict = ' + JSON.stringify(dict);
      var outputFname = './dist/assets/js/dict.' + locale + '.js';
      fs.writeFileSync(outputFname, content);
    }

    if(checksumChanged(content, 'tmp/upload/' + JS_DICT_FNAME)){
      console.log('Master catalog didn\'t since last upload - using cached dictionaries for JS.');
      localeCodes.map(function(code){
        var body = fs.readFileSync('tmp/download/' + code + '-' + JS_DICT_FNAME, {encoding: 'UTF8'});
        deployJSDict(code, body);
      });
      jsDefer.resolve();
    } else {
      mkdirp.sync('tmp/upload');
      mkdirp.sync('tmp/download');
      fs.writeFile('tmp/upload/' + JS_DICT_FNAME, content);
      smartling.send(content, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID, JS_DICT_FNAME).then(function(){
        var defers = localeCodes.map(function(code){
          return smartling.fetch(smartlingConfig.URL, code, JS_DICT_FNAME, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID).then(function(body){
            fs.writeFile('tmp/download/' + code + '-' + JS_DICT_FNAME, body);
            deployJSDict(code, body);
          });
        });

        // when all translations are fetched - call callback
        Q.all(defers).then(function(){
          jsDefer.resolve();
        });
      });
    }

    Q.all([yamlDefer.promise, jsDefer.promise]).then(function(){
      cb();
    });
  });

};
