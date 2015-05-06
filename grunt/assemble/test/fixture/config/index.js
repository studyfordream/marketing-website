var grunt = require('grunt');
var baseConfig = require('../../../../_assemble').options;
var configObj = {
  config: {
    guts: 'website-guts',
    content: 'website',
    helpers: 'website-guts/helpers'
  },
  link_path: '/dist',
  apiDomain: '',
  sassImagePath: '/dist/assets/img',
  environment: 'dev',
  environment: 'website-guts/data/environments/development/environmentVariables.json'
};

grunt.initConfig(configObj);
var config = grunt.config.process(baseConfig);

module.exports = config;
