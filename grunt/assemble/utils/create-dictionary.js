var path = require('path');
var _ = require('lodash');
var marked = require('optimizely-marked');
var splitKey = require('./split-key');

//need to have a way to recognize markdown in page content in hbs template outside of front matter
//when putting data back in must recognize arrays and sub out strings in objects accordingly
module.exports = function (assemble) {
  var locales = assemble.get('data.locales');

  //array will only be translated if key defining the array has a TR or MD flag
  //otherwise keys like layout_body_class or src containing arrays will be put into
  //translation dict.if the array contains only strings all those strings will be returned
  //for translation. if it contains an object only those keys with TR|MD will be processed
  function processArray(arr, type, parser) {
    var reduced =  arr.reduce(function(map, item, index) {
      var val;
      if(_.isPlainObject(item)) {
        val = parser(item);
      } else if(Array.isArray(item)) {
        val = processArray(item, type, parser);
      } else if(type === 'MD') {
        val = marked(item);
      } else {
        val = item;
      }

      if(val) {
        map.push(val);
      }
      return map;
    }, []);

    return reduced;
  }

  function translatePageContent(key, split, fileObj, mdParser) {
    var prefix = split[0];
    var suffix = split[1];
    var pageContent, val;
    var isPageContent = fileObj.data && fileObj.data[key] && suffix === 'page_content';
    if(isPageContent) {
      pageContent = fileObj.contents.toString();  //convert the buffer object
      val = ( prefix === 'MD' ) ? mdParser(pageContent) : pageContent;
      delete fileObj.data[key];

      return val;
    } else {
      return false;
    }
  }

  var createDictionary = function createDictionary(fileData, locale) {
    var linkPath = assemble.get('data.linkPath');
    var data = fileData.data || fileData;
    var translationKeys = [
      'TR',
      'MD',
      'HTML'
    ];

    if(Object.keys(locales).indexOf(locale) !== -1) {
      linkPath = path.join(linkPath, locale);
    }

    //set the markdown parser options
    marked.setOptions({
      linkPath: linkPath,
      smartypants: true
    });

    return Object.keys(data).reduce(function(o, key){
      var split = splitKey(key);
      var prefix = split[0];
      var suffix = split[1];
      var val, recursed;
      var isPageContent = translatePageContent(key, split, fileData, marked);

      if( translationKeys.indexOf(prefix) !== -1 && isPageContent ) {
        //key will get mutated to have an HTML prefix inside the translatePageContent function
        val = isPageContent;
        key = 'HTML_' + suffix;
      } else if( ( translationKeys.indexOf(prefix) !== -1 ) && ( data[key] !== 'object' || Array.isArray(data[key]) ) ) {
        //if it's an array remember the key
        if(Array.isArray(data[key])) {
          val = processArray(data[key], prefix, createDictionary);
        } else if(prefix === 'MD') {
            val = marked(data[key]);
            //mutate the original object for later page data extension
            //with parsed markdown
            delete data[key];
            key = 'HTML_' + suffix;
            data[key] = val;
        } else {
          val = data[key];
        }

        //fucking null....are you kidding me!!!!
      } else if( _.isPlainObject(data[key]) ) {
        recursed = createDictionary(data[key]);
        //this is important, keeps keys with empty values from being added
        if(Object.keys(recursed).length > 0) {
          o[key] = recursed;
        }
      }

      if(val) {
        o[key] = val;
      }

      return o;
    }, {});

  };

  return createDictionary;
};
