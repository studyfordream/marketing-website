module.exports = {
  cssSourceMap: {
    src: '<%= config.temp %>/css/styles.css.map',
    dest: '<%= config.dist %>/assets/css/styles.css.map'
  },
  fonts: {
    files: [
      {
        cwd: '<%= config.guts %>/assets/fonts/',
        src: '**',
        dest: '<%= config.dist %>/assets/fonts/',
        expand: true
      }
    ]
  },
  fastclick: {
    files: [
      {
        '<%= config.dist %>/assets/js/libraries/fastclick.js': ['<%= config.bowerDir %>/fastclick/lib/fastclick.js']
      }
    ]
  },
  img: {
    files: [
      {
        cwd: '<%= config.guts %>/assets/img/',
        src: '**',
        dest: '<%= config.dist %>/assets/img/',
        expand: true
      },
      {src: ['<%= config.guts %>/assets/img/favicon.ico'], dest: '<%= config.dist %>/favicon.ico'},
    ]
  },
  js: {
    files: [
      {
        cwd: '<%= config.guts %>/assets/js/ppc/libraries',
        src: '**',
        dest: '<%= config.dist %>/assets/js/ppc/libraries/',
        expand: true
      }
    ]
  }
};
