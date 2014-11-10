module.exports = {
  dev: {
    bsFiles: {
        src : ['<%= config.guts %>/assets/js/**/*', '<%= config.guts %>/assets/css/**/*']
    },
    options: {
        proxy: '0.0.0.0:9000',
        watchTask: true
    }
  }
};