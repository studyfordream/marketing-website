module.exports = {
  options: {
    options: ['last 2 versions', 'Firefox ESR'],
    // map: true
  },
  files: {
    flatten: true,
    src: '<%= config.temp %>/css/styles.css',
    dest: '<%= config.dist %>/assets/css/styles.css'
  }
};
