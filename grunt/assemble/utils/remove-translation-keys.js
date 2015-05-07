var _ = require('lodash');
var splitKey = require('./split-key');

module.exports = function(fileData, locale) {

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
  function removeTranslationKeys(fileData) {
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
      } else if( ( _.isString(val) || _.isNumber(val) || _.isNull(val) ) && parsedKey ) {
        if (/\\n+/g.test(val)) {
          val = val.replace(/\\n+/g, '');
        }

        if(parsedKey[0] === 'HTML') {
          var pathRe = new RegExp('\/dist\/(?!' + locale + '\/)', 'g');
          if(locale && pathRe.test(val)) {
            //replace href's that may have been parsed in markdown
            //`/press`, `/split-testing`
            val = val.replace(pathRe, '/dist/' + locale + '/');
          }
        }

        if(key === 'HTML_page_content') {
          fileData.page_content = val;
        } else {
          fileData[ parsedKey[1] ] = val;
        }

        delete fileData[key];
      }
    }
  }

  removeTranslationKeys(fileData);
};
