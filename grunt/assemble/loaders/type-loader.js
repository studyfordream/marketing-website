var fs = require('fs');
var path = require('path');
var globby = require('globby');
var matter = require('gray-matter');
var _ = require('lodash');

module.exports = function (assemble) {
  return function typeLoader(templates) {
    var websiteRoot = assemble.get('data.websiteRoot');
    var isTest = assemble.get('env');
    var locales = assemble.get('data.locales');
    var keys = Object.keys(templates);
    var localeKeys = Object.keys(locales);
    if(isTest === 'test') {
      localeKeys.unshift(websiteRoot);
    }
    keys.forEach(function (key) {
      localeKeys.forEach(function (locale) {
        var localeKey = locale + '_' + key;
        templates[localeKey] = _.merge({}, templates[key]);
        templates[localeKey].data = templates[localeKey].data || {};
        templates[localeKey].data.locale = locale;
      });
    });
    return templates;
  };
};
