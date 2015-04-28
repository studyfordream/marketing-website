var path = require('path');
var _ = require('lodash');

module.exports = function(assemble) {
  var websiteGuts = assemble.get('data.websiteGuts');
  var localeKeys = Object.keys(assemble.get('data.locales'));

  return function mergeLayoutData(pageDataClone) {
    _.forEach(pageDataClone, function(typeData, locale) {
        var partialPaths = Object.keys(typeData).filter(function(fp) {
          return /templates\/partials\//.test(fp);
        });

      _.forEach(typeData, function(fileData, fp) {
        var layoutKeys = Object.keys(fileData.layouts || {});
        var layoutData, trHelperCache = {};

        if(layoutKeys.length) {
          layoutData = layoutKeys.reduce(function(o, key) {
            var data = fileData.layouts[key];
            var helperData = ( typeData[key] && typeData[key].helper_phrases ) || {};
            if(_.isArray(helperData)) {
              delete typeData[key].helper_phrases;
            } else {
              data.helper_phrases = helperData;
            }
            _.merge(o, data);
            return o;
          }, {});

          //merge the layout data onto the pageDataClone file data
          _.merge(fileData, layoutData);
          //store the layout file paths in an array
          fileData.layouts = layoutKeys;
        }

        //TODO: cleanup this logic and move into an appropriate file
        //adding helpers from modals and all the partial helpers because they are not isolated per page
        if(localeKeys.indexOf(locale) !== -1 && ( fileData.layout_modals || fileData.modals )) {
          var layoutModals = fileData.layout_modals || [];
          var pageModals = fileData.modals || [];
          var allModals = layoutModals.concat(pageModals || []);
          var modalPaths = allModals.map(function(filename) {
            return path.join('/website-guts/templates/components/modals', filename);
          });

          var modalHelperData = modalPaths.reduce(function(o, modalPath) {
            var modalHelpers = ( typeData[modalPath] && typeData[modalPath].helper_phrases ) || {};
            _.merge(o, modalHelpers);
            return o;
          }, {});

          var partialHelperData = partialPaths.reduce(function(o, partialPath) {
            var partialHelpers = ( typeData[partialPath] && typeData[partialPath].helper_phrases ) || {};
            _.merge(o, partialHelpers);
            return o;
          }, {});

          if(fileData.helper_phrases) {
            _.merge(fileData.helper_phrases, partialHelperData, modalHelperData);
          }

        }
      });

    });
  };
};
