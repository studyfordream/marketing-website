module.exports = {
  options: {
    options: ['last 2 versions', 'Firefox ESR'],
    map: true
  },
  files: {
    flatten: true,
    expand: true,
    src: '<%= config.temp %>/css/*.css',
    dest: '<%= config.dist %>/assets/css/'
  }
};
