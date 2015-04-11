require('script!history.js/scripts/bundled/html4+html5/jquery.history');
require('script!oform/dist/oForm.min');

//require the top level utils
var requireUtils = require.context('./utils', false, /^(?!form\-filler\.js).*\.js$/);
var utilsPaths = requireUtils.keys();
utilsPaths.forEach(requireUtils);

//require the form helper constructor
var requireFormFactory = require('./utils/form_helpers/form_helper_factory'); // jshint ignore:line

//require all form helpers omitting the already included factory constructor
var requireFormHelpers = require.context('./utils/form_helpers', false, /^(?!form\_helper\_factory).*\.js$/);
var helperPaths = requireFormHelpers.keys();
helperPaths.forEach(requireFormHelpers);

// require the global js
var requireGlobal = require.context('./globals', false, /^(?!translations).*\.js$/);
var globalsPaths = requireGlobal.keys();
globalsPaths.forEach(requireGlobal);

// // all of the components
var requireComponents = require.context('./components', false, /\.js$/);
requireComponents.keys().forEach(requireComponents);

//require all form helpers omitting the user_state that is previously injected in the head with the hbs helper
var requireServices = require.context('./services', false, /^(?!user\_state).*\.js$/);
var servicePaths = requireServices.keys();
servicePaths.forEach(requireServices);
