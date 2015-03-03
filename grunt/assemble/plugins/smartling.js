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


module.exports = function (assemble) {
  var lang = assemble.get('lang') || {};
  var pageData = assemble.get('pageData');
  var environment = assemble.option('environment');
  var websiteRoot = assemble.get('data.websiteRoot');
  var locales = assemble.get('data.locales');
  var localeCodes = ['de_DE', 'fr_FR', 'sp_SP', 'jp_JP'];
  var createTranslationDict = require('../utils/create-dictionary')(assemble);
  var locale;

  return through.obj(function (file, enc, cb) {
    // instead of middleware
    // load file.data information onto `assemble.get('lang')` here
    var page, data, modalData, parsedTranslations;
    var allRoots = locales.concat(websiteRoot);
    var rootIndex = file.path.indexOf('/' + websiteRoot + '/');
    var localeIndex = _.findIndex(locales, function(locale) {
      var re = new RegExp(locale);
      return re.test(file.path);
    });
    var pagePath = true;

    if(rootIndex !== -1) {
      locale = websiteRoot;
    } else if(localeIndex !== -1) {
      locale = locales[localeIndex];
    } else {
      pagePath = false;
      locale = path.dirname(file.path).split('/').slice(-1)[0];
      page = path.join(locale, path.basename(file.path, path.extname(file.path)));
    }

    if(pagePath) {
      //if it's a page file other than the root homepage the path is the dirname
      page = path.dirname(file.path).split('/').slice(-1)[0];

      //if the page is the root homepage normalize it's key to `index`
      if(allRoots.indexOf(page) !== -1) {
        page = path.basename(file.path, path.extname(file.path));
      }

      //must extend local page data (i.e. from YML file) before parsing for translation
      if(pageData[locale][page]) {
        extend(file.data, pageData[locale][page]);
      }

      parsedTranslations = createTranslationDict(file, locale);

      if(Object.keys(parsedTranslations).length > 0) {
        lang[locale] = lang[locale] || {};
        lang[locale][page] = extend({}, lang[locale][page], parsedTranslations);
      }

      //parse the file.data for TR and MD and put it on lang
      //put the pageData on file.data

    } else {
      //can parse the file.data here for TR or MD instead of in the transform on put it on lang
      //if there is page data (there shouldn't ever be YAML for layouts|modals|partials put it on the file.data
      parsedTranslations = createTranslationDict(file, locale);
      if(Object.keys(parsedTranslations).length > 0) {
        lang[locale] = lang[locale] || {};
        lang[locale][page] = parsedTranslations;
      }
    }

    this.push(file);
    cb();
  }, function (cb) {
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
      var translations = [];
      var defers = localeCodes.map(function(code){
        return smartling.fetch(smartlingConfig.URL, code, DICT_FNAME, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID).then(function(body){
          //fs.writeFileSync(code + '-' + DICT_FNAME, body);
          //console.log(smartling.parsePOWithContext(body));
          translations[code] = smartling.parsePOWithContext(body);
        });
      });

      // when all translations are fetched - call callback
      q.all(defers).then(function(){
        console.log(translations);  // this logs the translations array to the console
        console.log(_.isArray(translations), translations.length); // this lenght is zero and when I try to write the file it's an empty array
        console.log('path', path.join(process.cwd(), 'translations', 'translations.js'));
        fs.writeFileSync(path.join(process.cwd(), 'translations', 'translations.js'), JSON.stringify(translations), {encoding: 'utf8'});
        assemble.set('translated', translations);
        cb();
      });
    });

  });
};
