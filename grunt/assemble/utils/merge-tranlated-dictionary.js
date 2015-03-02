var _ = require('lodash');

function processTransArray(nonTransArr, transArr, parser) {
  var reduced =  nonTransArr.reduce(function(map, item, index) {
    var val;
    if(_.isPlainObject(item)) {
      val = parser(item, transArr[index]);
    } else if(Array.isArray(item)) {
      val = processTransArray(item, transArr[index], parser);
    } else {
      //if it is is not an array or object, it is assumed to need translation therefore push from
      //the translated array
      val = transArr[index];
    }

    if(val) {
     map.push(val);
    }
    return map;
  }, []);

  return reduced;
}

//function takes the file data object with all merged context and the translated dictionary and returns 
//an object with merged translated and non-translated values
module.exports = function mergeTranslations(data, translated) {

  return Object.keys(data).reduce(function(o, key) {
    var split = key.split('_')[0];
    var isTransVal = split === 'MD' || split === 'TR';
    var nonTransVal = data[key];
    var transVal;
    try {
      transVal = translated[key];
    } catch(e) {
      console.error(e);
    }
    var isObject = _.isPlainObject(nonTransVal);
    var isArray = Array.isArray(nonTransVal);
    var val;

    //if anything nested needs to be translated then the key should exist in the translated dictionary
    if(transVal) {
      if(isObject) {
        val = mergeTranslations(nonTransVal, transVal);
      } else if(isArray && isTransVal) {
        val = processTransArray(nonTransVal, transVal, mergeTranslations);
      } else {
        val = transVal;
      }
    }

    if(val) {
      o[key] = val;
    }

    return o;
  }, _.clone(data));
};
