'use strict';
var path = require('path');
var extend = require('extend-shallow');
/**
 * args =>
 *  0 => name
 *  1 => transform
 *  2 => patterns
 *  3 => locale
 */

//method scopes page data from YML file in same directory onto the `lang` object
//must remember to account for YML data that is intended to be global
module.exports = function translationTransform (assemble, args) {
  var lang = assemble.get('lang') || {};
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var pageData = assemble.get('pageData') || {};
  var translationType = args[0];
  var patterns = args[2];
  var locale = args[3];
  var processYMLfile = require('./translation-helpers/yml-file-data')(assemble);
  var createTranslationDict = require('../utils/create-dictionary')(assemble);
  var data, parsedTranslations, root;
  patterns = Array.isArray(patterns) ? patterns : [patterns];

  if( /page/.test(translationType) ) {
    data = processYMLfile(patterns, locale);
  } else if ( /subfolder/.test(translationType) ) {
    data = processYMLfile(patterns, locale, path.join(subfoldersRoot, locale));
  } else {
    //NOTE: this was ommitted and is being performed in the smartling plugin
    //put partial, modal, layout specific parsing here is necessary
    translationType = translationType.split('-')[0];
  }

  parsedTranslations = createTranslationDict(data, locale);
  if(Object.keys(parsedTranslations).length > 0) {
    lang[locale] = extend({}, lang[locale], parsedTranslations);
  }
  pageData[locale] = extend({}, pageData[locale], data);


  // add logic for pulling out whitelisted TR and MD strings
  // this transorm fetches all of the YML data in the files same directory
  // would have to add some sort of whitelist/blacklist here for scoping some of the YML company data globally
  // how will we later reference this data in templates, assuming with keyword `this`
  assemble.set('pageData', pageData);
  assemble.set('lang', lang);
};

