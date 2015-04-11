var path = require('path');

module.exports = {
  options: {
    environment: '<%= grunt.config.get("environment") %>',
    banner: '<%= grunt.config.get("concat_banner") %>',
    footer: '<%= grunt.config.get("concat_footer") %>',
    root: '<%= grunt.config.get("dist") %>',
    publicPath: '/assets/js/'
  },
  pages: {
    src: ['pages/*.js', 'layouts/*.js'],
    cwd: '<%= config.guts %>/assets/js/',
    dest: '<%= config.dist %>/assets/js/'
  },
  globalBundle: {
    src: 'global.js',
    cwd: '<%= config.guts %>/assets/js/',
    dest: '<%= config.dist %>/assets/js/'
  }
};
