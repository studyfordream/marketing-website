/*
  Helper function to mark messages that should be localized.
  Later it may be changed to retrieve actual translations from somewhere.
  It allows to substitute messages - for example tr("Hi {0}, this is {1}", "Bob", "Jerry"); will return "Hi Bob, this is Jerry"
 */
/**
 * Returns localized version of a string with parameters substituted.
 * Everything after first argument is considered as substitutions.
 * @param {String} str -  String to localize
 * @param {...*} substitutions - Substitution parameters
 * @returns {String} Localized string
 */
module.exports = w.optly.tr = function(str) {
  // If w.optlyDict is present - use it for dictionary lookup.
  // Need to have a global variable here because it must be declared *before* app load because app may need to localize
  // message during initialize.
  if(typeof w.optlyDict !== 'undefined' && w.optlyDict[str] !== null) {
    str = w.optlyDict[str];
  }

  var subs = [].slice.call(arguments, 1);
  if(subs.length > 0){
    // Convert message resource to string if we need to make a substitutions
    return str.toString().replace(/\\*{(\d+)}/g, function(match, number) {
      var slashes = match.substring(0, match.indexOf('{'));
      if(slashes.length === 1) {
        // single slash used to escape curly bracket
        return match.substr(1);
      }
      else if(typeof subs[number] === 'undefined') {
        return match;
      }
      return slashes + subs[number];
    });
  }
  return str;
};
