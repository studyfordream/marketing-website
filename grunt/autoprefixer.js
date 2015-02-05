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
  om: {
    flatten: true,
    expand: true,
    src: '<%= config.temp %>/css/om/*.css',
    dest: '<%= config.dist %>/assets/css/om/'
  }
};
