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
  js: {
    files: ['<%= config.guts %>/assets/js/**/*.js', '!<%= config.guts %>/assets/js/services/user_state.js', '<%= config.temp %>/assets/js/**/*.js'],
    tasks: ['config:dev', 'jshint:clientDev', 'jshint:server', 'handlebars', 'modernizr', 'concat', 'clean:postBuild']
  },
  clientHandlebarsTemplates: {
    files: ['<%= config.guts %>/templates/client/**/*.hbs'],
    tasks: ['config:dev', 'jshint', 'handlebars', 'concat', 'clean:postBuild']
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