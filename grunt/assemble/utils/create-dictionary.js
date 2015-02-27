var path = require('path');
var marked = require('optimizely-marked');

//need to have a way to recognize markdown in page content in hbs template outside of front matter
//when putting data back in must recognize arrays and sub out strings in objects accordingly
module.exports = function (assemble) {
  var linkPath = assemble.get('data.linkPath');

  function parseMarkdown(mdStr, MDparser) {
    return MDparser(mdStr);
  }

  function processArray(arr, type, parser, MDparser) {
    var reduced =  arr.reduce(function(map, item, index) {
      if(typeof item === 'object') {
        map.push(parser(item));
      } else {
        //if it is already know it needs to be translated then push it and return
        if(type === 'MD') {
          item = parseMarkdown(item);
        }
        map.push(item);
      }
      return map;
    }, []);

    return reduced;
  }

  var createDictionary = function createDictionary(data, locale) {
    var locales = assemble.get('data.locales');

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
            if(Array.isArray(data[key])) {
            val = processArray(data[key], split, createDictionary);
          } else {
            val = parseMarkdown(data[key], marked);
          }
          break;
          case 'TR':
            if(Array.isArray(data[key])) {
            val = processArray(data[key], split, createDictionary, marked);
          } else {
            val = data[key];
          }
          break;
        }
      //fucking null....are you kidding me!!!!
      } else if(typeof data[key] === 'object' && data[key] !== null) {
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
