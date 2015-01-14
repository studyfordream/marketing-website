module.exports = {
  namespacePages: {
    options: {
      banner: '<%= grunt.config.get("concat_banner") %>',
      footer: '<%= grunt.config.get("concat_footer") %>'
    },
    src: ['pages/*.js', 'layouts/*.js'],
    expand: true,
    cwd: '<%= config.dist %>/assets/js/',
    dest: '<%= config.dist %>/assets/js/'
  },
  namespaceGlobal: {
    options: {
      banner: '<%= grunt.config.get("concat_banner") %>',
      footer: '<%= grunt.config.get("concat_footer") %>'
    },
    files: {
        '<%= config.dist %>/assets/js/bundle.js': [
          '<%= config.dist %>/assets/js/bundle.js'
          ]
    }
  },
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
