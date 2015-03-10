var _ = require('lodash');

function splitKey(str) {
  var split;

  if( /^(MD|TR|HTML)_/.test(str) ) {
    split = str.split(/_(.+)?/);
  }
  return split;
}

/* jshint ignore:start */
function processTransArray(arr) {
  arr.forEach(function(item) {

    if(_.isPlainObject(item)) {
      removeTranslationKeys(item);
    } else if(_.isArray(item)) {
      processTransArray(item);
    }

  });
}

function removeTranslationKeys(fileData) {
  var key, parsedKey, val;

  for(key in fileData) {
    val = fileData[key];
    parsedKey = splitKey(key);

    if(_.isPlainObject(val)) {
      removeTranslationKeys(val);
    } else if(_.isArray(val) && parsedKey) {
      processTransArray(val);
    } else if( ( _.isString(val) || _.isNumber(val) ) && parsedKey ) {
      if(parsedKey[0] === 'HTML' && fileData.content) {
        //account for replacing file content
        fileData.content = val;
      } else {
        fileData[ parsedKey[1] ] = val;
      }
      delete fileData[key];
    }
  }
}

module.exports = removeTranslationKeys;
/* jshint ignore:end */
