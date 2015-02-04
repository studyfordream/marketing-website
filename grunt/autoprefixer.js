module.exports = {
  options: {
    options: ['last 2 versions', 'Firefox ESR'],
    map: true
  },
  website: {
    flatten: true,
    expand: true,
    src: '<%= config.temp %>/css/*.css',
    dest: '<%= config.dist %>/assets/css/'
  },
  ppc: {
    flatten: true,
    expand: true,
    src: '<%= config.temp %>/css/ppc/*.css',
    dest: '<%= config.dist %>/assets/css/ppc/'
  }
};
