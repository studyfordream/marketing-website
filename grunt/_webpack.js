var path = require('path');

module.exports = {
  options: {
    environment: '<%= grunt.config.get("environment") %>',
    banner: '<%= grunt.config.get("concat_banner") %>',
    footer: '<%= grunt.config.get("concat_footer") %>',
    root: '<%= grunt.config.get("dist") %>',
    publicPath: '/assets/js/',
    stats: {
      colors: true,
      modules: true,
      reasons: true
    },
    dest: '<%= config.dist %>/assets/js/'
  },
  pages: {
    src: ['pages/*.js', 'layouts/*.js'],
    cwd: '<%= config.guts %>/assets/js/'
  },
  globalBundle: {
    src: 'global.js',
    cwd: '<%= config.guts %>/assets/js/'
  }
};
