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
      '<%= config.dist %>/assets/js/libraries/fastclick.js': ['<%= config.dist %>/assets/js/libraries/fastclick.js']
    }
  },
  omGlobalJS: {
    files: {
    '<%= config.dist %>/assets/js/om/bundle.js': ['<%= config.dist %>/assets/js/om/bundle.js']
    }
  },
  omLayoutFiles: {
    files: [
      {
        expand: true,
        cwd: '<%= config.dist %>/assets/js/om/layouts/',
        src: '**/*.js',
        dest: '<%= config.dist %>/assets/js/om/layouts',
        flatten: true
      }
    ]
  }
};
