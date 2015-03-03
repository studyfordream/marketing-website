var path = require('path');
var _ = require('lodash');
var marked = require('optimizely-marked');

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

  var createDictionary = function createDictionary(fileData, locale) {
    var linkPath = assemble.get('data.linkPath');
    var data = fileData.data || fileData;

    if(locales.indexOf(locale) !== -1) {
      linkPath = path.join(linkPath, locale);
    }

    //set the markdown parser options
    marked.setOptions({
      linkPath: linkPath,
      smartypants: true
    });

    return Object.keys(data).reduce(function(o, key){
      var split = key.split('_');
      var prefix = split[0];
      var suffix = split[1] + '_' + split[2];
      var val;
      var recursed;
      var pageContent;

      if( ( prefix === 'MD' || prefix === 'TR' ) && ( data[key] !== 'object' || Array.isArray(data[key]) ) ) {
        switch(prefix) {
          case 'MD':
            //if it's an array remember the key
            if(Array.isArray(data[key])) {
              val = processArray(data[key], prefix, createDictionary);
            } else {
              val = marked(data[key]);
            }
            break;
          case 'TR':
            if(suffix === 'page_content' && data[key] === 'MD') {
              pageContent = fileData.contents.toString();  //convert the buffer object
              switch(data[key]) {
                case 'MD':
                  val = marked(pageContent);
                  break;
                default:
                  val = pageContent;
                  break;
              }
              key = 'HTML_' + suffix; //set the key so it later overwrites `file.content` in middleware
              break; //break out early if this key is for page content translation
            }
            //if it's an array remember the key
            if(Array.isArray(data[key])) {
              val = processArray(data[key], prefix, createDictionary);
            } else {
              val = data[key];
            }
            break;
        }
        //fucking null....are you kidding me!!!!
      } else if( _.isPlainObject(data[key]) ) {
        recursed = createDictionary(data[key]);
        //this is important, keeps keys with empty values from being added
        if(Object.keys(recursed).length > 0) {
          o[key] = recursed;
        }
      }
      //else if( Array.isArray(data[key]) ) {
      //val = processArray(data[key], prefix, createDictionary);
      //}

      if(val) {
        o[key] = val;
      }

      return o;
    }, {});

  };

  return createDictionary;
};
