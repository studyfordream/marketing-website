require('script!history.js/scripts/bundled/html4+html5/jquery.history');
require('script!oform/dist/oForm.min');

/**
 * These function calls bootstrap all of the global files, essentially requiring them in
 * to mimic concat behavior. This is a temporary solution until we begin `require`ing utilities
 * into page level JS rather than referencing them as globals.
 * RegEx excludes files that have already been required in a specific order or those that should be omitted.
 *
 * Function require.context
 * @returns {Object}
 * ex. {
 *  './utils/form_helper_facory.js': fucntion(fp) {
 *    //when executed this function will call all code inside the specified module
 *  }
 * }
 */
var allGlobals = [
  require.context('./utils', false, /^(?!\.\/form-filler\.js).*\.js$/),
  require.context('./utils/form_helpers', false, /^(?!\.\/form_helper_factory\.js).*\.js$/),
  require.context('./globals', false, /^(?!\.\/translation\.js).*\.js$/),
  require.context('./components', false, /\.js$/),
  require.context('./services', false, /^(?!\.\/user_state\.js).*\.js$/)
];

var each = function(arr, fn) {
  for(var i=0; i < arr.length; i+=1) {
    fn(arr[i], i);
  }
};

each(allGlobals, (context) => {
  if(typeof context.keys === 'function') {
    each(context.keys(), context);
  }
});
