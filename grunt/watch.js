var exclude = [
  '!node_modules/**/*',
  '!bower_components/**/*'
];

module.exports = {
  sassom: {
    files: '<%= config.guts %>/assets/css/om/**/*.{css,scss}',
    tasks: ['config:dev', 'sass:dev', 'replace', 'autoprefixer', 'clean:postBuild']
  },
  jsom: {
    files: ['<%= config.guts %>/assets/js/om/**/*.js'],
    tasks: ['config:dev', 'jshint:clientDev', 'jshint:server', 'modernizr', 'concat:namespaceOMPages', 'concat:omBundle', 'concat:jqueryModernizrOM', 'copy:omUITest', 'clean:postBuild']
  },
  sass: {
    files: ['<%= config.guts %>/assets/css/**/*.scss', '!<%= config.guts %>/assets/css/om/**/*.{css,scss}'],
    tasks: ['config:dev', 'sass:dev', 'replace', 'autoprefixer', 'clean:postBuild']
  },
  img: {
    files: ['<%= config.guts %>/assets/img/*.{png,jpg,svg}'],
    tasks: ['copy:img']
  },
  test: {
    files: ['test/**/*.js'],
    tasks: ['jshint:test', 'jshint:server']
  },
  livereload: {
    options: {
      livereload: '<%= connect.options.livereload %>'
    },
    files: [
      '<%= config.dist %>/**/*.html',
      '!<%= config.dist %>/partners/**/*.html',
      '<%= config.dist %>/assets/**/*.{css,js}'
    ].concat(exclude)
  }
};
