var path = require('path');
var _ = require('lodash');
var ignore = [
  'website',
  'modals',
  'partials',
  'layouts'
];

module.exports = function(assemble) {

  return function mergeLayoutData(pageDataClone) {
    _.forEach(pageDataClone, function(typeData, type) {
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

        if(ignore.indexOf(type) === -1 && ( fileData.layout_modals || fileData.modals )) {
          var layoutModals = fileData.layout_modals || [];
          var pageModals = fileData.modals || [];
          var allModals = layoutModals.concat(pageModals || []);
          var modalPaths = allModals.map(function(filename) {
            return path.join('/website-guts/templates/components/modals', filename);
          });

          var modalHelperData = modalPaths.reduce(function(o, modalPath) {
            //var partialPath, partialFilename, partialHelpers;
            var modalHelpers = ( typeData[modalPath] && typeData[modalPath].helper_phrases ) || {};

            //if(!modalHelpers || Object.keys(modalHelpers).length === 0) {
              //partialFilename = path.basename(modalPath).split('_')[0] + '_form';
              //partialPath = path.dirname(modalPath.replace('components/modals', 'partials')) + '/' + partialFilename;
              //partialHelpers = typeData[partialPath] && typeData[partialPath].helper_phrases;

              //if(_.isPlainObject(partialHelpers)) {
                //_.merge(modalHelpers, partialHelpers);
              //}
            //}
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
