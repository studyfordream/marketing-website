var path = require('path');
var fs = require('fs');
var Q = require('q');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var objParser = require('l10n-tools/object-extractor');
var jsParser = require('l10n-tools/js-parser');
var hbsParser = require('l10n-tools/hbs-parser');
var smartling = require('l10n-tools/smartling');
var glob = require('glob');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var generateKey = require('../../utils/generate-key');

module.exports = function(assemble) {
  var websiteGuts = assemble.get('data.websiteGuts');
  var smartlingConfig;
  var DICT_FNAME = 'marketing_website_yaml.pot';
  var JS_DICT_FNAME = 'marketing_website_js.pot';
  var createDirs = [
    'tmp/upload',
    'tmp/download',
    'dist/assets/js'
  ];
  var translations = {};
  var locales = assemble.get('data.locales');
  var localeCodes = Object.keys(locales).map(function(subfolder) {
    return locales[subfolder];
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

  function catalogChanged(content, fname){
    if(!fs.existsSync(fname)) {
      return true;
    }
    // extract list of keys (basically all the messages), sort them alphabetically and join together
    var keys = Object.keys(smartling.parsePO(content)).sort().join('');
    var latestKeys = Object.keys(smartling.parsePO(fs.readFileSync(fname, {encoding: 'UTF8'}))).sort().join('');
    return keys !== latestKeys;
  }

  try{
    smartlingConfig = fs.readFileSync(path.join(process.cwd(), 'configs/secret/smartlingConfig.json'), {encoding: 'utf8'});
  } catch(err){
    console.error('Cannot read Smartling config: ', err);
  }
  if(smartlingConfig){
    smartlingConfig = JSON.parse(smartlingConfig);
  }

  return function() {
    var lang = assemble.get('lang');
    var yamlDefer = Q.defer();
    var jsDefer = Q.defer();
    var phrases = [];

    _.forEach(lang, function(pages){
      _.forEach(pages, function(fileInfo, fname){
        var list = objParser.extract(fileInfo);
        phrases.push({fname: fname, phrases: list});
      });
    });


    createDirs.forEach(function(dir) {
      if(!fs.existsSync(dir)) {
        mkdirp.sync(dir);
      }
    });

    var content = smartling.generatePO(phrases);

    if(catalogChanged(content, 'tmp/upload/' + DICT_FNAME)){
      fs.writeFile('tmp/upload/' + DICT_FNAME, content);
      smartling.send(content, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID, DICT_FNAME).then(function(){
        var defers = localeCodes.map(function(code){
          return smartling.fetch(smartlingConfig.URL, code, DICT_FNAME, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID).then(function(body){
            fs.writeFile('tmp/download/' + code + '-' + DICT_FNAME, body);
            translations[code] = smartling.parsePO2dict(body);
          });
        });

        // when all translations are fetched - call callback
        Q.all(defers).then(function(){
          yamlDefer.resolve(translations);
        });
      });
    } else {
      console.log('Server catalog didn\'t change since last upload - using cached dictionaries.');
      localeCodes.map(function(code){
        var body = fs.readFileSync('tmp/download/' + code + '-' + DICT_FNAME, {encoding: 'UTF8'});
        translations[code] = smartling.parsePO2dict(body);
      });
      yamlDefer.resolve(translations);
    }

    var clientHbsPhrases = extractFrom(path.join(websiteGuts, 'templates/client/**/*.hbs'), hbsParser);
    var jsPhrases = extractFrom('website-guts/assets/js/**/*.js', jsParser).concat(clientHbsPhrases);
    content = smartling.generatePO(jsPhrases);
    var deployJSDict = function deployJSDict(locale, body) {
      var dict = smartling.parsePO2dict(body);
      content = 'window.optlyDict = ' + JSON.stringify(dict);
      var outputFname = './dist/assets/js/dict.' + locale + '.js';
      fs.writeFileSync(outputFname, content);
    };

    if(catalogChanged(content, 'tmp/upload/' + JS_DICT_FNAME)){
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
    } else {
      console.log('JS catalog didn\'t change since last upload - using cached dictionaries for JS.');
      localeCodes.map(function(code){
        var body = fs.readFileSync('tmp/download/' + code + '-' + JS_DICT_FNAME, {encoding: 'UTF8'});
        deployJSDict(code, body);
      });
      jsDefer.resolve();
    }

    return Q.all([yamlDefer.promise, jsDefer.promise]);
  };
};
