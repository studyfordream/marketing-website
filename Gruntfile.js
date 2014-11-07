'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-config')(grunt, {
      jitGrunt: {
          staticMappings: {
              replace: 'grunt-text-replace',
              handlebars: 'grunt-contrib-handlebars',
              resemble: 'grunt-resemble-cli',
              sass: 'grunt-sass',
              connect: 'grunt-contrib-connect'
          }
      },
      init: true
  });

  grunt.registerTask('staging-deploy', [
    'gitinfo',
    'config:staging',
    'jshint:clientDev',
    'jshint:server',
    'clean:preBuild',
    'assemble',
    'handlebars',
    'modernizr',
    'concat',
    'sass:prod',
    'autoprefixer',
    'copy',
    'uglify',
    's3:staging',
    'clean:postBuild'
  ]);

  grunt.registerTask('smartling-staging-deploy', [
    'gitinfo',
    'config:smartlingStaging',
    'jshint:clientDev',
    'jshint:server',
    'clean:preBuild',
    'assemble',
    'handlebars',
    'modernizr',
    'concat',
    'sass:prod',
    'autoprefixer',
    'copy',
    'uglify',
    's3:smartling',
    'clean:postBuild'
  ]);

  grunt.registerTask('server', [
    'config:dev',
    'jshint:clientDev',
    'jshint:server',
    'clean:preBuild',
    'assemble',
    'handlebars',
    'modernizr',
    'concat',
    'sass:dev',
    'replace',
    'autoprefixer',
    'copy',
    'clean:postBuild',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'config:production',
    'jshint:clientProd',
    'jshint:server',
    'clean:preBuild',
    'assemble',
    'handlebars',
    'modernizr',
    'concat',
    'sass:prod',
    'autoprefixer',
    'copy',
    'uglify',
    'filerev',
    'userevvd',
    'clean:postBuild'
  ]);

  grunt.registerTask('test', [
    'config:dev',
    'jshint:clientProd',
    'jshint:server',
    'clean:preBuild',
    'assemble',
    'handlebars',
    'modernizr',
    'concat',
    'sass:dev',
    'replace',
    'autoprefixer',
    'copy',
    'clean:postBuild',
    'connect:resemble',
    'resemble'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
