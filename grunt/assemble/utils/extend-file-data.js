var extend = require('extend-shallow');
var _ = require('lodash');

function replacePageContent(file, dict, locale, key) {
  if( dict[locale] && dict[locale][key] && dict[locale][key].HTML_page_content ) {
    file.HTML_page_content = dict[locale][key].HTML_page_content;
  }
}

module.exports = function(assemble) {
  var websiteRoot = assemble.get('data.websiteRoot');
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var locales = assemble.get('data.locales');
  var pagesNamespace = assemble.get('data.pageContentNamespace');

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
    //or if page content is markdown and has been parsed
    //if(lang[locale] && lang[locale][dataKey] && lang[locale][dataKey].HTML_page_content) {

      ////check if the specific file has body content that was translated
      ////and replace the file content because string will match in dictionary
      //fileData.content = lang[locale][dataKey].HTML_page_content;
    //}

    if(fpData.isRoot) {
      //replace page content with that from the root dictionary
      replacePageContent(fileData, lang, locale, dataKey);

      //extend file data with external YML data
      if(pageData[locale][dataKey]) {
        fileData.data[pagesNamespace] = pageData[locale][dataKey][pagesNamespace];
      }

    } else if(fpData.isSubfolder) {
      parentPageData = ( pageData[websiteRoot] && pageData[websiteRoot][parentKey] ) || {};
      subfolderPageData = ( pageData[locale] && pageData[locale][dataKey] ) || {};

      if(fileData.hasOwnTemplate) {
        //replace page content with that from the locale dictionary
        replacePageContent(fileData, lang, locale, dataKey);

        //merge external page data from YML onto the locale file data
        _.merge(fileData.data, subfolderPageData);
      } else {
        //if(lang[websiteRoot] && lang[websiteRoot][parentKey] && lang[websiteRoot][parentKey].HTML_page_content) {
          //fileData.HTML_page_content = lang[websiteRoot][parentKey].HTML_page_content;
        //}

        //check the parent folder for body content to be translated
        replacePageContent(fileData, lang, websiteRoot, parentKey);

        if (Object.keys(parentPageData).length > 0) {
          //extend the locale specific data and potentially website root data
          //this is what allows for swaps
          fileData.data[pagesNamespace] = _.merge({}, parentPageData[pagesNamespace], subfolderPageData[pagesNamespace]);
        }
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
