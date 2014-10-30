'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-config')(grunt, {
        // ...
      jitGrunt: {
          // here you can pass options to jit-grunt (or just jitGrunt: true)
          staticMappings: {
              // here you can specify static mappings, for example:
              replace: 'grunt-text-replace',
              handlebars: 'grunt-contrib-handlebars',
              resemble: 'grunt-resemble-cli',
              sass: 'grunt-sass',
              connect: 'grunt-contrib-connect'
          }
      },
      init: true
  });
  //jit-grunt loads only the npm tasks required for the grunt task.
  //makes livereload much faster.

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
    'uglify',
    'sass:prod',
    'autoprefixer',
    'copy',
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
    'uglify',
    'sass:prod',
    'autoprefixer',
    'copy',
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
    'copy',
    'uglify',
    'sass:prod',
    'replace',
    'autoprefixer',
    'filerev',
    'userevvd',
    'clean:postBuild'
  ]);

  grunt.registerTask('test', [
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
    'connect:resemble',
    'resemble'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
