//get configs
var fs,
    creds;
fs = require('fs');
(function(){
  try{
      creds = fs.readFileSync('./configs/s3Config.json', {encoding: 'utf-8'});
  } catch(err){

  }
  if(creds){
    creds = JSON.parse(creds);
  }
})();

var config = {
  options: {
    logOutput: false
  },
  production: {
    options: {
      variables: {
        environment: 'production',
        environmentData: 'website-guts/data/environments/production/environmentVariables.json',
        assetsDir: '/dist/assets',
        link_path: '',
        sassImagePath: '/img',
        compress_js: true,
        drop_console: true,
        concat_banner: '(function($, w, d){ \n\n' +
                       '  window.optly = window.optly || {}; \n\n' +
                       '  window.optly.mrkt = window.optly.mrkt || {}; \n\n' +
                       '  window.linkPath = "" \n\n' +
                       '  try { \n\n',
        concat_footer: '  } catch(error){ \n\n' +
                       '  //report errors to GA \n\n' +
                       '  window.console.log("js error: " + error);' +
                       '  } \n' +
                       '})(jQuery, window, document);'
      }
    }
  },
  staging: {
    options: {
      variables: {
        aws: creds,
        environment: 'staging',
        environmentData: 'website-guts/data/environments/staging/environmentVariables.json',
        assetsDir: '/<%= grunt.option("branch") || gitinfo.local.branch.current.name %>/assets',
        link_path: '/<%= grunt.option("branch") || gitinfo.local.branch.current.name %>',
        sassImagePath: '/<%= grunt.option("branch") || gitinfo.local.branch.current.name %>/assets/img',
        compress_js: true,
        drop_console: false,
        concat_banner: '(function($, w, d){ \n\n' +
                       '  window.optly = window.optly || {}; \n\n' +
                       '  window.optly.mrkt = window.optly.mrkt || {}; \n\n' +
                       '  window.linkPath = "<%= gitinfo.local.branch.current.name %>" \n\n' +
                       '  try { \n\n',
        concat_footer: '  } catch(error){ \n\n' +
                       '  //report errors to GA \n\n' +
                       '  window.console.log("js error: " + error);' +
                       '  } \n' +
                       '})(jQuery, window, document);'
      }
    }
  },
  smartlingStaging: {
    options: {
      variables: {
        aws: creds,
        environment: 'staging',
        environmentData: 'website-guts/data/environments/staging/environmentVariables.json',
        assetsDir: '/assets',
        link_path: '',
        sassImagePath: '/assets/img',
        compress_js: true,
        drop_console: false,
        concat_banner: '(function($, w, d){ \n\n' +
                       '  window.optly = window.optly || {}; \n\n' +
                       '  window.optly.mrkt = window.optly.mrkt || {}; \n\n' +
                       '  window.linkPath = "<%= gitinfo.local.branch.current.name %>" \n\n' +
                       '  try { \n\n',
        concat_footer: '  } catch(error){ \n\n' +
                       '  //report errors to GA \n\n' +
                       '  window.console.log("js error: " + error);' +
                       '  } \n' +
                       '})(jQuery, window, document);'
      }
    }
  },
  dev: {
    options: {
      variables: {
        environment: 'dev',
        environmentData: 'website-guts/data/environments/development/environmentVariables.json',
        assetsDir: '/dist/assets',
        link_path: '/dist',
        sassSourceMap: true,
        sassImagePath: '/dist/assets/img',
        compress_js: false,
        drop_console: false,
        concat_banner: '(function($, w, d){ \n\n' +
                       '  window.optly = window.optly || {}; \n\n' +
                       '  window.optly.mrkt = window.optly.mrkt || {}; \n\n' +
                       '  window.linkPath = "/dist" \n\n',
        concat_footer: '})(jQuery, window, document);'
      }
    }
  },
  content: 'website',
  guts: 'website-guts',
  dist: 'dist',
  temp: 'temp',
  helpers: 'website-guts/helpers-v6',
  bowerDir: 'bower_components',
};

module.exports = config;
