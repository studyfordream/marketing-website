module.exports = {
  assemble: {
    files: [
      '<%= config.content %>/**/*.{hbs,yml}',
      '!<%= config.content %>/partners/**/*.{hbs,yml}',
      '!<%= config.content %>/resources/resources-list/**/*.{hbs,yml}',
      '!<%= config.content %>/resources/index.hbs',
      '<%= config.guts %>/templates/**/*.hbs',
      '!<%= config.guts %>/templates/**/*_compiled.hbs',
      '!<%= config.guts %>/templates/client/**/*.hbs',
      '<%= config.guts %>/assets/js/services/user_state.js',
      '<%= config.guts %>/helpers/**/*.js'
    ],
    tasks: ['config:dev', 'assemble:modals', 'assemble:pages']
  },
  assemblePartners: {
    files: [
      '<%= config.content %>/partners/**/*.{hbs,yml}',
      '<%= config.guts %>/templates/**/*.hbs',
      '!<%= config.guts %>/templates/**/*_compiled.hbs',
      '!<%= config.guts %>/templates/client/**/*.hbs'
    ],
    tasks: ['config:dev', 'assemble:partners']
  },
  assembleResources: {
    files: [
      '<%= config.content %>/resources/resources-list/**/*.{hbs,yml}',
      '<%= config.content %>/resources/*.{hbs,yml}',
      '<%= config.guts %>/templates/**/*.hbs',
      '!<%= config.guts %>/templates/**/*_compiled.hbs',
      '!<%= config.guts %>/templates/client/**/*.hbs'
    ],
    tasks: ['config:dev', 'assemble:resources']
  },
  sass: {
    files: '<%= config.guts %>/assets/css/**/*.scss',
    tasks: ['config:dev', 'sass', 'replace', 'autoprefixer', 'clean:postBuild']
  },
  img: {
    files: ['<%= config.guts %>/assets/img/*.{png,jpg,svg}'],
    tasks: ['copy:img']
  },
  test: {
    files: ['test/**/*.js'],
    tasks: ['jshint:test']
  },
  livereload: {
    options: {
      livereload: '<%= connect.options.livereload %>'
    },
    files: [
      '<%= config.dist %>/**/*.{html,css,js,png,jpg,svg}'
    ]
  }
};
