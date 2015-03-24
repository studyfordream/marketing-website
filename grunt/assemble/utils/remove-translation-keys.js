var _ = require('lodash');
var splitKey = require('./split-key');

function processTransArray(arr, parser) {
  arr.forEach(function(item) {

    if(_.isPlainObject(item)) {
      parser(item);
    } else if(_.isArray(item)) {
      processTransArray(item);
    }

  });
  return arr;
}

/**
 * Utility function for removing TR|MD|HTML YML translation prefixes
 *
 * @param {Object} `fileData` Assemble File data object
 * @return {undefined} Mutates the data object passed to it
 *
 */

module.exports = function removeTranslationKeys(fileData) {
  var key, parsedKey, val, split;

  for(key in fileData) {
    val = fileData[key];
    split = splitKey(key);
    parsedKey = _.isArray(split) ? split : undefined;

    if(_.isPlainObject(val)) {
      removeTranslationKeys(val);
    } else if(_.isArray(val) && parsedKey) {
      fileData[ parsedKey[1] ] = processTransArray(val, removeTranslationKeys);
      delete fileData[key];
    } else if( ( _.isString(val) || _.isNumber(val) ) && parsedKey ) {
      if (/\\n+/g.test(val)) {
        val = val.replace(/\\n+/g, '');
      }
      if(parsedKey[0] === 'HTML' && parsedKey[1] === 'page_content' && fileData.content) {
        //account for replacing file content
        fileData.content = val;
      } else {
        fileData[ parsedKey[1] ] = val;
      }
      delete fileData[key];
    }
  }
};
