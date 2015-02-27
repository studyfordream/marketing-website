var path = require('path');
var marked = require('optimizely-marked');

//need to have a way to recognize markdown in page content in hbs template outside of front matter
//when putting data back in must recognize arrays and sub out strings in objects accordingly
module.exports = function (assemble) {
  var locales = assemble.get('data.locales');

  function parseMarkdown(mdStr) {
    return marked(mdStr);
  }

  //array will only be translated if key defining the array has a TR or MD flag
  //otherwise keys like layout_body_class or src containing arrays will be put into
  //translation dict.if the array contains only strings all those strings will be returned
  //for translation. if it contains an object only those keys with TR|MD will be processed
  function processArray(arr, type, parser) {
    var reduced =  arr.reduce(function(map, item, index) {
      var val;
      if(typeof item === 'object' && item !== null) {
        val = parser(item);
      } else if(Array.isArray(item)) {
        val = processArray(item, type, parser);
      } else if(type === 'MD') {
        val = parseMarkdown(item);
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

  var createDictionary = function createDictionary(data, locale) {
    var linkPath = assemble.get('data.linkPath');

    if(locales.indexOf(locale) !== -1) {
      linkPath = path.join(linkPath, locale);
    }

    //set the markdown parser options
    marked.setOptions({
      linkPath: linkPath,
      smartypants: true
    });

    return Object.keys(data).reduce(function(o, key){
      var split = key.split('_')[0];
      var val;
      var recursed;

      if( ( split === 'MD' || split === 'TR' ) && ( data[key] !== 'object' || Array.isArray(data[key]) ) ) {
        switch(split) {
          case 'MD':
            //if it's an array remember the key
            if(Array.isArray(data[key])) {
            val = processArray(data[key], split, createDictionary);
          } else {
            val = parseMarkdown(data[key]);
          }
          break;
          case 'TR':
            //if it's an array remember the key
            if(Array.isArray(data[key])) {
            val = processArray(data[key], split, createDictionary);
          } else {
            val = data[key];
          }
          break;
        }
        //fucking null....are you kidding me!!!!
      } else if(typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key]) ) {
        recursed = createDictionary(data[key]);
        //this is important, keeps keys with empty values from being added
        if(Object.keys(recursed).length > 0) {
          o[key] = recursed;
        }
      }
      //else if( Array.isArray(data[key]) ) {
        //val = processArray(data[key], split, createDictionary);
      //}

      if(val) {
        o[key] = val;
      }

      return o;
    }, {});

  };

  return createDictionary;
};
