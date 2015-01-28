require('script!jquery-cookie/jquery.cookie');
require('script!history.js/scripts/bundled-uncompressed/html4+html5/jquery.history');
require('script!momentjs');
require('script!fitvids');
require('script!oform/src/oForm');

//require the top level utils
var requireUtils = require.context('./utils', false, /\.js$/);
var utilsPaths = requireUtils.keys();
utilsPaths.splice(utilsPaths.indexOf('./form-filler.js'), 1);
utilsPaths.forEach(requireUtils);

//require the form helper constructor
var requireFormFactory = require('./utils/form_helpers/form_helper_factory'); // jshint ignore:line

//require all form helpers omitting the already included factory constructor
var requireFormHelpers = require.context('./utils/form_helpers', false, /\.js$/);
var helperPaths = requireFormHelpers.keys();
helperPaths.splice(helperPaths.indexOf('./form_helper_factory.js'), 1);
helperPaths.forEach(requireFormHelpers);

// require the global js
var requireGlobal = require.context('./globals', false, /\.js$/);
var globalsPaths = requireGlobal.keys();
globalsPaths.splice(globalsPaths.indexOf('./translation.js'), 1);
globalsPaths.forEach(requireGlobal);

// // all of the components
var requireComponents = require.context('./components', false, /\.js$/);
requireComponents.keys().forEach(requireComponents);

//require all form helpers omitting the user_state that is previously injected in the head with the hbs helper
var requireServices = require.context('./services', false, /\.js$/);
var servicePaths = requireServices.keys();
servicePaths.splice(servicePaths.indexOf('./user_state.js'), 1);
servicePaths.forEach(requireServices);
