/*var recurseRequire = function(argsObj) {*/
  //var dirPath = argsObj.dirPath,
    //splicePath = argsObj.splicePath,
    //recursive = argsObj.recursive,
    //requiredFiles = require.context('./' + dirPath, false, /\.js$/),
    //paths = requiredFiles.keys();
    //if (splicePath) {
      //paths.splice(paths.indexOf('./' + splicePath), 1);
    //}
    //paths.forEach(requiredFiles);
/*};*/

//require the rest of the top level utils
var requireUtils = require.context('./utils', false, /\.js$/);
requireUtils.keys().forEach(requireUtils);

//require the form helper constructor
 var requireFormFactory = require('./utils/form_helpers/form_helper_factory');

// //require all form helpers omitting the already included factory constructor
 var requireFormHelpers = require.context('./utils/form_helpers', false, /\.js$/);
 var helperPaths = requireFormHelpers.keys();
 helperPaths.splice(helperPaths.indexOf('./form_helper_factory.js'), 1);
 helperPaths.forEach(requireFormHelpers);

var requireGlobal = require.context('./bundle', false, /\.js$/);
requireGlobal.keys().forEach(requireGlobal);
 
// //recurseRequire({
//   //dirPath: 'utils/form_helpers',
//   //splicePath: 'form_helper_factory.js',
//   //recursive: false
// //});
// // all of the components
 var requireComponents = require.context('./components', false, /\.js$/);
 requireComponents.keys().forEach(requireComponents);
// //recurseRequire({
//   //dirPath: 'components',
//   //recursive: false
// //});
// //require all form helpers omitting the user_state that is previously injected in the head with the hbs helper
 var requireServices = require.context('./services', false, /\.js$/);
 var servicePaths = requireServices.keys();
 servicePaths.splice(servicePaths.indexOf('./user_state.js'), 1);
 servicePaths.forEach(requireServices);

//recurseRequire({
  //dirPath: 'services',
  //splicePath: 'user_state.js',
  //recursive: false
//});
