'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  var dateVar = grunt.template.today('dddd, mmmm dS, yyyy, h:MM:ss TT');

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
        jasmine_node: 'grunt-jasmine-node',
        assemble: 'grunt/assemble/'
      }
    },
    data: {
      dateVar: dateVar,
      marketingDistName: 'website-stable'
    },
    init: true
  });

  grunt.registerTask('staging-deploy', [
    'gitinfo',
    'config:staging',
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
    if (which) {
      task += ':' + which;
    }

    grunt.task.run([
      'config:dev',
      'jshint:test',
      task
    ]);
  });

  grunt.registerTask('test', [
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
    'connect:resemble',
    'jasmine_node',
    'resemble'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
  grunt.loadNpmTasks('grunt-github-releaser');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('forceoff', 'Forces the force flag off', function() {
    grunt.option('force', false);
  });

  grunt.registerTask('forceon', 'Forces the force flag on', function() {
    grunt.option('force', true);
  });

  grunt.registerTask('release', 'makes a release to github', function() {
    // Use the forceon option for all tasks that need to continue executing in case of error
    var prepare = ['prompt', 'build'];
    var compress = ['compress'];
    var git_release_tasks = ['gitfetch', 'forceon', 'gittag', 'gitpush', 'forceoff', 'github-release'];
    
    grunt.task.run(prepare);
    grunt.task.run(compress);
    grunt.task.run(git_release_tasks);
  });

};
