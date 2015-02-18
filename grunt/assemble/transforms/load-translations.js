'use strict';

/**
 * args =>
 *  0 => name
 *  1 => transform
 *  2 => patterns
 *  3 => locale
 */

module.exports = function translationTransform (assemble, args) {
  var path = require('path');
  var lang = assemble.get('lang') || {};

  var patterns = args[2];
  var locale = args[3];

  patterns = Array.isArray(patterns) ? patterns : [patterns];

  var Plasma = require('plasma');
  var plasma = new Plasma();
  plasma.option('cwd', locale);
  plasma.option('namespace', function(fp) {
    return path.dirname(fp).split('/').slice(-1);
  });
  var data = plasma.load(patterns);

  // logic for pulling out whitelisted TR and MD strings
  lang[locale] = data;


  assemble.set('lang', lang);
};
