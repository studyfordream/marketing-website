module.exports = {
  options: {
    mangle: false,
    beautify: false,
    compress: {
      drop_console: '<%= grunt.config.get("compress_js") %>'
    }
  },
  globalJS: {
    files: {
      '<%= config.dist %>/assets/js/libraries/fastclick.js': ['<%= config.bowerDir %>/fastclick/lib/fastclick.js'],
      '<%= config.dist %>/assets/js/bundle.js': ['<%= config.dist %>/assets/js/bundle.js']
    }
  },
  pageFiles: {
    files: [
      {
        expand: true,
        cwd: '<%= config.dist %>/assets/js/',
        src: 'pages/*.js',
        dest: '<%= config.dist %>/assets/js/pages',
        flatten: true
      }
    ]
  },
  layoutFiles: {
    files: [
      {
        expand: true,
        cwd: '<%= config.dist %>/assets/js/',
        src: 'layouts/*.js',
        dest: '<%= config.dist %>/assets/js/layouts',
        flatten: true
      }
    ]
  }
};
