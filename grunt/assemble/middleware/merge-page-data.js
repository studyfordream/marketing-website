var path = require('path');
var extend = require('extend-shallow');
var _ = require('lodash');

module.exports = function(assemble) {
  var lang = assemble.get('lang');
  var websiteRoot = assemble.get('data.websiteRoot');
  var basename = assemble.get('data.basename');
  var locales = assemble.get('data.locales');
  var modalWhitelist = assemble.get('data.modalYamlWhitelist');

  return function mergePageData (file, next) {
    var locale, page, data, modalData;
    var modalsKey = 'modals';
    var key = path.dirname(file.path);
    var rootIndex = key.indexOf('/' + websiteRoot + '/');
    var localeIndex = _.findIndex(locales, function(locale) {
      var re = new RegExp(locale);
      return re.test(key);
    });

    // pageData.about

    // normalize key
    if(rootIndex !== -1) {
      key = key.substr(rootIndex + 1);
    } else if(localeIndex !== -1) {
      locale = locales[localeIndex];
    }

    data = lang[locale || websiteRoot];

    //specific logic for appending modal data to `lang` object
    //appends only once and will add locale specific modal data to
    //lang[locale].modals[<modal_file_name_no_ext>]
    //this modal data should maybe be done in a transform but it is easier here
    //because modals live in website-guts and are not specific to locals yet
    if(/modal/.test(key)) {
      if(!data[modalsKey]) {
        data[modalsKey] = {};
      }
      //if it's a modal file the key is the filename
      page = path.basename(file.path, '.hbs');

      //check if the modal exists in the root website dir
      if( !lang[websiteRoot][modalsKey][page] ) {
        modalData = data[modalsKey][page] = {};
        //use the whitelist to retrieve modal data
        _.forEach(file.data, function(val, key) {
          if(modalWhitelist.indexOf(key) !== -1) {
            modalData[key] = val;
          }
        });
        lang = extend({}, lang, data);
        assemble.set('lang', lang);
      }
    } else {
      //if it's a page file the path is the dirname
      //after the language tranformation this appends language specific data
      //to the file data
      page = key.split('/').slice(-1)[0];
      file.data = extend({}, file.data, data[page]);
    }

    next();
  };
};
