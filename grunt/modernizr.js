module.exports = {
  build: {
    devFile: '<%= config.guts %>/assets/js/libraries/modernizr.2.8.3.js',
    outputFile: '<%= config.temp %>/assets/js/libraries/modernizr.2.8.3.min.js',
    uglify: true,
    tests: ['teststyles'],
    files: {
      src: ['<%= config.guts %>/assets/js/**/*.js', '!<%= config.guts %>/assets/js/libraries/*.js']
    },
    extensibility : {
      addtest: true,
      teststyles: true,
      testprops: true,
      testallprops: true,
    },
    matchCommunityTests: true,
    parseFiles: true
  }
};
