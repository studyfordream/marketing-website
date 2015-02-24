'use strict';
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
  var translationType = args[0];
  var patterns = args[2];
  var locale = args[3];
  var processYMLfile = require('./translation-helpers/yml-file-data');
  var processFrontMatter = require('./translation-helpers/yml-front-matter-data')(assemble);
  var langKeys = {
    modal: 'modals',
    layout: 'layouts'
  };
  var data;

  patterns = Array.isArray(patterns) ? patterns : [patterns];

  if( /page/.test(translationType) || /subfolder/.test(translationType) ) {
    data = processYMLfile(patterns, locale);
    lang[locale] = extend({}, lang[locale], data);
  } else if( /modal/.test(translationType) || /layout/.test(translationType) ) {
    translationType = translationType.split('-')[0];
    data = processFrontMatter(translationType, patterns, locale);
    lang = extend({}, lang, data);
  }

  // add logic for pulling out whitelisted TR and MD strings
  // this transorm fetches all of the YML data in the files same directory
  // would have to add some sort of whitelist/blacklist here for scoping some of the YML company data globally
  // how will we later reference this data in templates, assuming with keyword `this`

  console.log(Object.keys(lang.website));
  assemble.set('lang', lang);
};
