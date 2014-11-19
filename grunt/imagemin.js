module.exports = {
  prod: {
    files: [
      {
        cwd: '<%= config.guts %>/assets/img/',
        src: '**/*.{jpg,jpeg,gif,png,svg}',
        dest: '<%= config.dist %>/assets/img/',
        expand: true
      }
    ]
  }
};
