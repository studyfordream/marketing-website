module.exports = {
  assemble: {
    files: [
      '<%= config.content %>/**/*.{hbs,yml}',
      '!<%= config.content %>/partners/**/*.{hbs,yml}',
      '!<%= config.content %>/resources/resources-list/**/*.{hbs,yml}',
      '!<%= config.content %>/resources/index.hbs',
      '!<%= config.content %>/free-trial-n/**/*.hbs',
      '<%= config.guts %>/templates/**/*.hbs',
      '!<%= config.guts %>/templates/ppc/**/*.hbs',
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
      '!<%= config.guts %>/templates/ppc/**/*.hbs',
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
      '!<%= config.guts %>/templates/ppc/**/*.hbs',
      '!<%= config.guts %>/templates/**/*_compiled.hbs',
      '!<%= config.guts %>/templates/client/**/*.hbs'
    ],
    tasks: ['config:dev', 'assemble:resources']
  },
  assemblePPC: {
    files: [
      '<%= config.content %>/free-trial-n/**/*.{hbs,yml}',
      '<%= config.guts %>/templates/ppc/**/*.hbs'
    ],
    tasks: ['config:dev', 'assemble:ppc']
  },
  sassPPC: {
    files: '<%= config.guts %>/assets/css/ppc/**/*.{css,scss}',
    tasks: ['config:dev', 'sass:dev', 'replace', 'autoprefixer', 'clean:postBuild']
  },
  jsPPC: {
    files: ['<%= config.guts %>/assets/js/ppc/**/*.js'],
    tasks: ['config:dev', 'jshint:clientDev', 'jshint:server', 'modernizr', 'concat:ppc', 'concat:jqueryModernizrPPC', 'clean:postBuild']
  },
  sass: {
    files: ['<%= config.guts %>/assets/css/**/*.scss', '!<%= config.guts %>/assets/css/ppc/**/*.{css,scss}'],
    tasks: ['config:dev', 'sass:dev', 'replace', 'autoprefixer', 'clean:postBuild']
  },
  img: {
    files: ['<%= config.guts %>/assets/img/*.{png,jpg,svg}'],
    tasks: ['copy:img']
  },
  js: {
    files: ['<%= config.guts %>/assets/js/**/*.js', '!<%= config.guts %>/assets/js/services/user_state.js', '!<%= config.guts %>/assets/js/ppc/**/*.js', '<%= config.temp %>/assets/js/**/*.js'],
    tasks: ['config:dev', 'jshint:clientDev', 'jshint:server', 'handlebars', 'modernizr', 'concat', 'clean:postBuild']
  },
  test: {
    files: ['test/**/*.js'],
    tasks: ['jshint:test']
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
