require('script!history.js/scripts/bundled/html4+html5/jquery.history');
require('script!oform/dist/oForm.min');

var allGlobals = [
  require.context('./utils', false, /^(?!\.\/form\-filler\.js).*\.js$/),
  require.context('./utils/form_helpers', false, /^(?!\.\/form\_helper\_factory\.js).*\.js$/),
  require.context('./globals', false, /^(?!\.\/translation\.js).*\.js$/),
  require.context('./components', false, /\.js$/),
  require.context('./services', false, /^(?!\.\/user\_state\.js).*\.js$/)
];

var each = function(arr, fn) {
  for(var i=0; i < arr.length; i+=1) {
    fn(arr[i], i);
  }
};

each(allGlobals, function(context) {
  if(typeof context.keys === 'function') {
    each(context.keys(), context);
  }
});
