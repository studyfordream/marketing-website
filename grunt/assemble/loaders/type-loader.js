var fs = require('fs');
var path = require('path');
var globby = require('globby');
var matter = require('gray-matter');
var _ = require('lodash');

module.exports = function (assemble) {
  return function typeLoader(templates) {
    var locales = assemble.get('data.locales');
    var keys = Object.keys(templates);
    keys.forEach(function (key) {
      Object.keys(locales).forEach(function (locale) {
        var localeKey = locale + '_' + key;
        templates[localeKey] = _.merge({}, templates[key]);
        templates[localeKey].data = templates[localeKey].data || {};
        templates[localeKey].data.locale = locale;
      });
    });
    return templates;
  };
};
