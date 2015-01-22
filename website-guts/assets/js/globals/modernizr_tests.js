/*  Random string function for analytics.identify
  * taken from here:
  * http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
  */
window.optly.mrkt.utils.randomString = function() {

  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for(var i=0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};
