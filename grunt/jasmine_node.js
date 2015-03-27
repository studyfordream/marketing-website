module.exports = {
  options: {
    showColors: true,
    includeStackTrace: false,
    projectRoot:'',
    forceExit: false,
    matchall: false,
    coffee: false,
    growl: false,
    asyncTimeout: 30000,
    verbose: false,
    consoleReporter: true,
    globals: {
      linkPath: '<%= grunt.config.get("link_path") %>'
    }
  },
  'pricing': {
    src: ['test/{pricing,features-and-plans}/**/*.js']
  },
  'dialogs': {
    src: ['test/dialogs/**/*.js']
  },
  'free-trial': {
    src: ['test/free-trial/**/*.js']
  },
  'mobile-mvpp': {
    src: ['test/mobile-mvpp/**/*.js']
  },
  'homepage': {
    src: ['test/homepage/**/*.js']
  },
  'features-and-plans': {
    src: ['test/features-and-plans/**/*.js']
  },
  'marketing-events': {
    src: ['test/marketing-events/**/*.js']
  },
  'misc': {
    src: ['test/misc/**/*.js']
  }
};
