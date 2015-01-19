module.exports = {
  jqueryModernizr: {
    src: [
      '<%= config.guts %>/assets/js/libraries/jquery-2.1.1.min.js',
      '<%= config.temp %>/assets/js/libraries/modernizr.2.8.3.min.js'
    ],
    expand: false,
    flatten: true,
    isFile: true,
    dest: '<%= config.dist %>/assets/js/libraries/jquery-modernizr.min.js'
  }
};
