var extend = require('extend-shallow');

module.exports = function(assemble) {
  var websiteRoot = assemble.get('data.websiteRoot');
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var locales = assemble.get('data.locales');

  return function mergeFileData(fpData, fileData) {
    var lang = assemble.get('lang');
    var pageData = assemble.get('pageData');
    var dataKey = fpData.dataKey;
    var locale = fpData.locale;
    var parentKey = fpData.parentKey;
    var parentPageData;
    var subfolderPageData;
    var htmlBodyContent;

    //append the HTML content onto the file for translation swap
    if(lang[locale] && lang[locale][dataKey] && lang[locale][dataKey].HTML_page_content) {

      //check if the specific file has body content that needs translating
      fileData.HTML_page_content = lang[locale][dataKey].HTML_page_content;
    }

    if(fpData.isRoot) {
      //extend file data with external YML data
      if(pageData[locale][dataKey]) {
        extend(fileData.data, pageData[locale][dataKey]);
      }

    } else if(fpData.isSubfolder) {
      parentPageData = ( pageData[websiteRoot] && pageData[websiteRoot][parentKey] ) || {};
      subfolderPageData = ( pageData[locale] && pageData[locale][dataKey] ) || {};

      //extend the locale specific data and potentially website root data
      //this is what allows for swaps
      if(fileData.hasOwnTemplate) {
        extend(fileData.data, subfolderPageData);
      } else {
        //check the parent folder for body content to be translated
        if(lang[websiteRoot] && lang[websiteRoot][parentKey] && lang[websiteRoot][parentKey].HTML_page_content) {
          fileData.HTML_page_content = lang[websiteRoot][parentKey].HTML_page_content;
        }

        extend(fileData.data, parentPageData, subfolderPageData);
      }

    }
    /* jshint ignore:start */
    else if(fpData.isModal || fpData.isPartial || fpData.isLayout) {
      //potentially cache key from previous page and translate modal data
    }
    /* jshint ignore:end */

    return fpData;
  };

};
