var jsParser = require('l10n-tools/js-parser');
var hbsParser = require('l10n-tools/hbs-parser');
var smartling = require('l10n-tools/smartling');
var Q = require('q');
var fs = require('fs');

try{
  var smartlingConfig = fs.readFileSync('./configs/smartlingConfig.json', {encoding: 'utf-8'});
} catch(err){
  console.error('Cannot read Smartling config: ', err);
}
if(smartlingConfig){
  smartlingConfig = JSON.parse(smartlingConfig);
}

module.exports = function (grunt) {
  var UPLOAD_FNAME = 'marketing_website.po';
  var SUPPORTED_LOCALES = ['fr-FR', 'de-DE', 'jp-JP', 'sp-SP'];

  function extract(done) {
    var jsPhrases = extractFrom('website-guts/assets/js/**/*.js', jsParser);
    var hbsPhrases = extractFrom('website-guts/templates/**/*.hbs', hbsParser);
    //console.log(hbsPhrases);
    return smartling.send(smartling.generatePO(jsPhrases.concat(hbsPhrases)), smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID, UPLOAD_FNAME)
  }

  function extractFrom(srcs, parser){
    return grunt.file.expand(srcs).map(function (fname) {
      var phrases = parser.extract(grunt.file.read(fname));
      return {
        fname: fname,
        phrases: phrases
      }
    });
  }

  function generate(localesStr) {
    if(localesStr == null){
      var locales = SUPPORTED_LOCALES;
    }
    else {
      locales = localesStr.split(/\s*,\s*/);
    }
    if(locales.length == 0) {
      console.error('No locales list. Abort.');
      return;
    }
    for(var ii = 0; ii < locales.length; ii++){
      if(SUPPORTED_LOCALES.indexOf(locales[ii]) == -1){
        console.error('Unknown locale %s. Aborting.', locales[ii]);
        return;
      }
    }
    var defs = locales.map(function (locale) {
      return smartling.fetch(smartlingConfig.URL, locale, UPLOAD_FNAME, smartlingConfig.API_KEY, smartlingConfig.PROJECT_ID)
        .then(function (content) {
          var dict = smartling.parsePO2dict(content);
          content = "window.optly.dict = " + JSON.stringify(dict);
          var outputFname = './dist/assets/js/dict.' + locale + '.js';
          //console.log('writing', outputFname);
          grunt.file.write(outputFname, content);
        });
    });
    return Q.all(defs);
  }

  grunt.registerTask('l10n:extract', function () {
    extract().then(this.async());
  });
  grunt.registerTask('l10n:generate', function (localesStr) {
    generate(localesStr).then(this.async());
  });
  grunt.registerTask('l10n:extract-generate', function (localesStr) {
    var done = this.async();
    extract().then(function () {
      generate(localesStr).then(done);
    })
  });
};