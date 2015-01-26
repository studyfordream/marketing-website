'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

  require('time-grunt')(grunt);

  //jit-grunt loads only the npm tasks required for the grunt task.
  //makes livereload much faster.
  require('load-grunt-config')(grunt, {
      jitGrunt: {
          staticMappings: {
              replace: 'grunt-text-replace',
              handlebars: 'grunt-contrib-handlebars',
              resemble: 'grunt-resemble-cli',
              sass: 'grunt-sass',
              connect: 'grunt-contrib-connect',
              jasmine_node: 'grunt-jasmine-node'
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
    'modernizr',
    'webpack',
    'concat',
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
    'modernizr',
    'webpack',
    'concat',
    'sass:prod',
    'autoprefixer',
    'copy',
    's3:smartling',
    'clean:postBuild'
  ]);
  
  grunt.registerTask('server', [
    'config:dev',
    'jshint:test',
    'clean:preBuild',
    'assemble',
    'modernizr',
    'webpack',
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
    'modernizr',
    'concat',
    'webpack',
    'sass:prod',
    'autoprefixer',
    'copy',
    'filerev',
    'userevvd',
    'clean:postBuild'
  ]);

  grunt.registerTask('ui-test', function(which) {
    var task = 'jasmine_node';
    if (which) task += ':' + which;

    grunt.task.run([
      'config:dev',
      'jshint:test',
      task
    ]);
  });

  grunt.registerTask('test', [
    'config:dev',
    'jshint:clientProd',
    'jshint:server',
    'jshint:test',
    'clean:preBuild',
    'assemble',
    'modernizr',
    'concat',
    'webpack',
    'sass:dev',
    'replace',
    'autoprefixer',
    'copy',
    'clean:postBuild',
    'connect:resemble',
    'jasmine_node',
    'resemble'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
