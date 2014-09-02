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
  require('jit-grunt')(grunt, {
    replace: 'grunt-text-replace',
    handlebars: 'grunt-contrib-handlebars'
  });

  //get configs
  var fs,
      creds;
  fs = require('fs');
  (function(){
    try{
        creds = fs.readFileSync('./configs/s3Config.json', {encoding: 'utf-8'});
    } catch(err){

    }
    if(creds){
      creds = JSON.parse(creds);
    }
  })();

  // Project configuration.
  grunt.initConfig({
    config: {
      options: {
        logOutput: false
      },
      production: {
        options: {
          variables: {
            environment: 'production',
            environmentData: 'website-guts/data/environments/production/environmentVariables.json',
            assetsDir: 'dist/assets',
            link_path: '',
            sassImagePath: '/dist/assets/img',
            compress_js: true,
            drop_console: true,
            concat_banner: '(function($){ \n\n' +
                           '  window.optly = window.optly || {}; \n\n' +
                           '  window.optly.mrkt = window.optly.mrkt || {}; \n\n' +
                           '  window.linkPath = "" \n\n' +
                           '  try { \n\n',
            concat_footer: '  } catch(error){ \n\n' +
                           '  //report errors to GA \n\n' +
                           '  window.console.log("js error: " + error);' +
                           '  } \n' +
                           '})(jQuery);'
          }
        }
      },
      staging: {
        options: {
          variables: {
            aws: creds,
            environment: 'staging',
            environmentData: 'website-guts/data/environments/staging/environmentVariables.json',
            assetsDir: '/<%= grunt.option("branch") || gitinfo.local.branch.current.name %>/assets',
            link_path: '/<%= grunt.option("branch") || gitinfo.local.branch.current.name %>',
            sassImagePath: '/<%= gitinfo.local.branch.current.name %>/assets/img',
            compress_js: true,
            drop_console: false,
            concat_banner: '(function($){ \n\n' +
                           '  window.optly = window.optly || {}; \n\n' +
                           '  window.optly.mrkt = window.optly.mrkt || {}; \n\n' +
                           '  window.linkPath = "<%= gitinfo.local.branch.current.name %>" \n\n' +
                           '  try { \n\n',
            concat_footer: '  } catch(error){ \n\n' +
                           '  //report errors to GA \n\n' +
                           '  window.console.log("js error: " + error);' +
                           '  } \n' +
                           '})(jQuery);'
          }
        }
      },
      smartlingStaging: {
        options: {
          variables: {
            aws: creds,
            environment: 'staging',
            environmentData: 'website-guts/data/environments/staging/environmentVariables.json',
            assetsDir: '/assets',
            link_path: '',
            sassImagePath: '/assets/img',
            compress_js: true,
            drop_console: false,
            concat_banner: '(function($){ \n\n' +
                           '  window.optly = window.optly || {}; \n\n' +
                           '  window.optly.mrkt = window.optly.mrkt || {}; \n\n' +
                           '  window.linkPath = "<%= gitinfo.local.branch.current.name %>" \n\n' +
                           '  try { \n\n',
            concat_footer: '  } catch(error){ \n\n' +
                           '  //report errors to GA \n\n' +
                           '  window.console.log("js error: " + error);' +
                           '  } \n' +
                           '})(jQuery);'
          }
        }
      },
      dev: {
        options: {
          variables: {
            environment: 'dev',
            environmentData: 'website-guts/data/environments/development/environmentVariables.json',
            assetsDir: '/dist/assets',
            link_path: '/dist',
            sassSourceMap: true,
            sassImagePath: '/dist/assets/img',
            compress_js: false,
            drop_console: false,
            concat_banner: '(function($){ \n\n' +
                           '  window.optly = window.optly || {}; \n\n' +
                           '  window.optly.mrkt = window.optly.mrkt || {}; \n\n' +
                           '  window.linkPath = "/dist" \n\n',
            concat_footer: '})(jQuery);'
          }
        }
      },
      content: 'website',
      guts: 'website-guts',
      dist: 'dist',
      temp: 'temp',
      helpers: 'website-guts/helpers',
      bowerDir: 'bower_components',
    },
    watch: {
      assemble: {
        files: [
          '<%= config.content %>/**/*.{hbs,yml}',
          '!<%= config.content %>/partners/**/*.{hbs,yml}',
          '<%= config.guts %>/templates/**/*.hbs',
          '!<%= config.guts %>/templates/**/*_compiled.hbs',
          '!<%= config.guts %>/templates/client/**/*.hbs',
          '<%= config.guts %>/helpers/**/*.js'
        ],
        tasks: ['config:dev', 'inline', 'assemble:pages', 'assemble:modals']
      },
      assemblePartners: {
        files: [
          '<%= config.content %>/partners/**/*.{hbs,yml}',
          '<%= config.guts %>/templates/**/*.hbs',
          '!<%= config.guts %>/templates/**/*_compiled.hbs',
          '!<%= config.guts %>/templates/client/**/*.hbs'
        ],
        tasks: ['config:dev', 'inline', 'assemble:partners']
      },
      sass: {
        files: '<%= config.guts %>/assets/css/**/*.scss',
        tasks: ['config:dev', 'sass', 'replace', 'autoprefixer', 'clean:postBuild']
      },
      img: {
        files: ['<%= config.guts %>/assets/img/*.{png,jpg,svg}'],
        tasks: ['copy:img']
      },
      inline: {
        files: ['<%= config.guts %>/assets/js/services/user_state.js'],
        tasks: ['config:dev', 'jshint', 'inline', 'assemble' ,'concat', 'clean:postBuild']
      },
      js: {
        files: ['<%= config.guts %>/assets/js/**/*.js', '<%= config.temp %>/assets/js/**/*.js'],
        tasks: ['config:dev', 'jshint:clientDev', 'jshint:server', 'handlebars', 'concat', 'clean:postBuild']
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
    },
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0',
        middleware: function(connect, options, middlewares){
          middlewares.unshift(function(req, res, next){
            if(req.method === 'POST'){

              if(req.url === '/webinar/register'){

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end( grunt.file.read('website-guts/endpoint-mocks/webinarSuccess.json') );

              } else if(req.url === '/webinar/register-fail'){

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end( grunt.file.read('website-guts/endpoint-mocks/webinarFail.json') );

              } else if(req.url === '/account/free_trial_landing'){

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end( grunt.file.read('website-guts/endpoint-mocks/formSuccess.json') );

              } else if(req.url === '/account/free_trial_landing/account_exists'){

                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end( grunt.file.read('website-guts/endpoint-mocks/accountExists.json') );

              }
              else if(req.url === '/account/signin') {

                res.cookie('optimizely_signed_in', '1', {httpOnly: false});
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end('{"success": "true"}');

              } else {

                return next();

              }

            } else if(req.url === '/account/info') {

              res.writeHead(200, {'Content-Type': 'application/json'});
              res.end( grunt.file.read('website-guts/endpoint-mocks/accountInfo.json') );

            } else if(req.url === '/experiment/load_recent?max_experiments=5') {

              res.writeHead(200, {'Content-Type': 'application/json'});
              res.end( grunt.file.read('website-guts/endpoint-mocks/lastFiveExperiments.json') );

            } else if(req.url === '/account/signout') {

                res.cookie('optimizely_signed_in', '', {maxAge: 0, expires: new Date(Date.now() - 500000000), httpOnly: false});
                res.cookie('optimizely_signed_in', '', {maxAge: 0, expires: new Date(Date.now() - 500000000), httpOnly: false});
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end('{"success": "true"}');

            } else{

              return next();

            }

          });
          return middlewares;
        }
      },
      livereload: {
        options: {
          open: {
            target: 'http://0.0.0.0:9000/dist',
            base: '.'
          }
        }
      }
    },
    assemble: {
      options: {
        layoutdir: '<%= config.guts %>/templates/layouts/',
        assetsDir: '<%= grunt.config.get("assetsDir") %>',
        linkPath: '<%= grunt.config.get("link_path") %>',
        sassImagePath: '<%= grunt.config.get("sassImagePath") %>',
        environmentIsProduction: '<%= grunt.config.get("environmentIsProduction") %>',
        environmentIsDev: '<%= grunt.config.get("environmentIsDev") %>',
        data: ['<%= config.content %>/**/*.json', '<%= config.content %>/**/*.yml', '<%= grunt.config.get("environmentData") %>'],
        partials: ['<%= config.guts %>/templates/partials/*.hbs'],
        helpers: ['<%= config.helpers %>/**/*.js'],
      },
      modals: {
        options: {
          ext: '.hbs'
        },
        files: [
          {
            src: 'templates/components/modals/**/*.hbs',
            dest: '<%= config.guts %>/templates/partials/',
            cwd: '<%= config.guts %>/',
            expand: true,
            filter: 'isFile',
            flatten: true,
            rename: function(dest, src) {
              var split = src.split('.');
              return dest + split[0] + '_compiled';
            }
          }
        ]
      },
      partners: {
        options: {
          collections: [
            {
              name: 'integrations',
              inflection: 'integration',
              sortby: 'priority',
              sortorder: 'descending'
            },
            {
              name: 'solutions',
              inflection: 'solution',
              sortby: 'priority',
              sortorder: 'descending'
            }
          ]
        },
        files: [
          {
            src: ['**/*.hbs'],
            dest: '<%= config.dist %>/partners/',
            cwd: '<%= config.content %>/partners/',
            expand: true
          }
        ]
      },
      pages: {
        files: [
          {
            src: ['**/*.hbs', '!partners/**/*.hbs'],
            dest: '<%= config.dist %>/',
            cwd: '<%= config.content %>/',
            expand: true
          }
        ]
      }
    },
    sass: {
      prod: {
        options: {
          sourceMap: false,
          imagePath: '<%= grunt.config.get("sassImagePath") %>',
          precision: 3,
          outputStyle: 'compressed'
        },
        files: [
          {
            src: '<%= config.guts %>/assets/css/styles.scss',
            dest: '<%= config.temp %>/css/styles.css'
          }
        ]
      },
      dev: {
        options: {
          sourceMap: true,
          imagePath: '<%= grunt.config.get("sassImagePath") %>',
          precision: 3
        },
        files: [
          {
            src: '<%= config.guts %>/assets/css/styles.scss',
            dest: '<%= config.temp %>/css/styles.css'
          }
        ]
      }
    },
    replace: {
      cssSourceMap: {
        src: '<%= config.temp %>/css/styles.css.map',
        overwrite: true,
        replacements: [
          {
            from: 'website-guts/',
            to: '../../../website-guts/'
          }
        ]
      }
    },
    autoprefixer: {
      options: {
        options: ['last 2 versions', 'Firefox ESR'],
        map: true
      },
      files: {
        flatten: true,
        src: '<%= config.temp %>/css/styles.css',
        dest: '<%= config.dist %>/assets/css/styles.css'
      }
    },
    copy: {
      cssSourceMap: {
        src: '<%= config.temp %>/css/styles.css.map',
        dest: '<%= config.dist %>/assets/css/styles.css.map'
      },
      cssFontFile: {
        src: ['<%= config.guts %>/assets/css/fonts.css'],
        dest: '<%= config.dist %>/assets/css/fonts.css'
      },
      jquery: {
        files: [
          {
            '<%= config.dist %>/assets/js/libraries/jquery-2.1.1.min.js': ['<%= config.guts %>/assets/js/libraries/jquery-2.1.1.min.js']
          }
        ]
      },
      fastclick: {
        files: [
          {
            '<%= config.dist %>/assets/js/libraries/fastclick.js': ['<%= config.bowerDir %>/fastclick/lib/fastclick.js']
          }
        ]
      },
      img: {
        files: [
          {
            cwd: '<%= config.guts %>/assets/img/',
            src: '**',
            dest: '<%= config.dist %>/assets/img/',
            expand: true
          }
        ]
      }
    },
    clean: {
      preBuild: ['<%= config.dist %>/'],
      postBuild: ['<%= config.temp %>']
    },
    s3: {
      options: {
        key: '<%= grunt.config.get("aws.key") %>',
        secret: '<%= grunt.config.get("aws.secret") %>',
        access: 'public-read'
      },
      staging: {
        options: {
          bucket: '<%= grunt.config.get("aws.staging_bucket") %>'
        },
        upload: [
          {
            src: '<%= config.dist %>/**/*',
            dest: '<%= grunt.option("branch") || gitinfo.local.branch.current.name %>',
            rel: '<%= config.dist %>'
          }
        ]
      },
      smartling: {
        options: {
          bucket: '<%= grunt.config.get("aws.smartling_staging_bucket") %>'
        },
        upload: [
          {
            src: '<%= config.dist %>/**/*',
            dest: '',
            rel: '<%= config.dist %>'
          }
        ]
      }
    },
    jshint: {
      options: {
        trailing: true,
        curly: true,
        eqeqeq: true,
        indent: 4,
        latedef: true,
        noempty: true,
        nonbsp: true,
        undef: true,
        quotmark: 'single',
        '-W087': (function() {
          if(grunt.config.get("environment") == "dev") {
            return true;
          } else {
            return false;
          }
        }())
      },
      clientProd: {
        options: {
          browser: true,
          unused: true,
          globals: {
            jQuery: false,
            moment: false,
            $: false
          }
        },
        files: {
          src: ['<%= config.guts %>/assets/js/**/*.js', '!<%= config.guts %>/assets/js/libraries/**/*.js']
        }
      },
      clientDev: {
        options: {
          browser: true,
          globals: {
            jQuery: false,
            console: false,
            moment: false,
            _gaq: false,
            $: false
          }
        },
        files: {
          src: ['<%= config.guts %>/assets/js/**/*.js', '!<%= config.guts %>/assets/js/libraries/**/*.js']
        }
      },
      server: {
        options: {
          node: true
        },
        files: {
          src: ['<%= config.guts %>/helpers/*.js']
        }
      }
    },
    concat: {
      modernizr: {
        files: {
          '<%= config.dist %>/assets/js/libraries/modernizr.2.8.3.min.js': ['<%= config.guts %>/assets/js/libraries/modernizr.2.8.3.min.js']
        }
      },
      namespacePages: {
        options: {
          banner: '<%= grunt.config.get("concat_banner") %>',
          footer: '<%= grunt.config.get("concat_footer") %>'
        },
        src: ['pages/*.js', 'layouts/*.js'],
        expand: true,
        cwd: '<%= config.guts %>/assets/js/',
        dest: '<%= config.dist %>/assets/js/'
      },
      namespaceGlobal: {
        options: {
          banner: '<%= grunt.config.get("concat_banner") %>',
          footer: '<%= grunt.config.get("concat_footer") %>'
        },
        files: {
            '<%= config.temp %>/assets/js/global.js': [
              '<%= config.guts %>/assets/js/global.js',
              '<%= config.guts %>/assets/js/components/*.js',
              '<%= config.guts %>/assets/js/services/*.js',
              '!<%= config.guts %>/assets/js/services/user_state.js'
              ]
        }
      },
      concatBundle: {
        files: {
          '<%= config.dist %>/assets/js/bundle.js': [
            '<%= config.bowerDir %>/jquery-cookie/jquery.cookie.js',
            '<%= config.bowerDir %>/history.js/scripts/bundled-uncompressed/html4+html5/jquery.history.js',
            '<%= config.guts %>/assets/js/libraries/handlebars-v1.3.0.js',
            '<%= config.bowerDir %>/momentjs/moment.js',
            '<%= config.temp %>/assets/js/handlebarsTemplates.js',
            '<%= config.bowerDir %>/oform/dist/oForm.min.js',
            '<%= config.temp %>/assets/js/global.js',
            '<%= config.guts %>/assets/js/components/oForm-globals.js',
            '<%= config.bowerDir %>/fitvids/jquery.fitvids.js'
          ]
        }
      }
    },
    uglify: {
      options: {
        mangle: false,
        beautify: false,
        compress: {
          drop_console: '<%= grunt.config.get("compress_js") %>'
        }
      },
      globalJS: {
        files: {
          '<%= config.dist %>/assets/js/libraries/fastclick.js': ['<%= config.bowerDir %>/fastclick/lib/fastclick.js'],
          '<%= config.dist %>/assets/js/bundle.js': ['<%= config.dist %>/assets/js/bundle.js']
        }
      },
      pageFiles: {
        files: [
          {
            expand: true,
            cwd: '<%= config.dist %>/assets/js/',
            src: 'pages/*.js',
            dest: '<%= config.dist %>/assets/js/pages',
            flatten: true
          }
        ]
      },
      layoutFiles: {
        files: [
          {
            expand: true,
            cwd: '<%= config.dist %>/assets/js/',
            src: 'layouts/*.js',
            dest: '<%= config.dist %>/assets/js/layouts',
            flatten: true
          }
        ]
      }
    },
    'phantomcss-gitdiff': {
      options: {
        baseUrl: 'http://0.0.0.0:9000/',
        serverRoot: 'dist/',
        gitDiff: true,
      },
      desktop: {
        options: {
          screenshots: 'screens/desktop/',
          viewportSize: [1024, 768]
        },
        src: [
          'dist/{,**/}*.html'
        ]
      },
      mobile: {
        options: {
          screenshots: 'screens/mobile/',
          viewportSize: [320, 480]
        },
        src: [
          'dist/{,**/}*.html'
        ]
      }
    },
    imagemin: {
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
    },
    inline: {
      dist: {
          options:{
              uglify: true,
              exts: 'hbs'
          },
          src: ['<%= config.guts %>/templates/layouts/wrapper.hbs'],
          dest: ['<%= config.guts %>/templates/layouts/wrapper_compiled.hbs']
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: 'optly.mrkt.templates',
          processName: function(filePath){
            return filePath.replace(/^.*[\\\/]/, '').replace('.hbs', '');
          }
        },
        files: {
          '<%= config.temp %>/assets/js/handlebarsTemplates.js': ['<%= config.guts %>/templates/client/**/*.hbs']
        }
      }
    },
    filerev: {
      assets: {
        src: '<%= config.dist %>/assets/**/*.{js,css}'
      }
    },
    userevvd: {
      html: {
        options: {
          formatPath: function(path){
            return path.replace(/^dist\/assets/, 'https://cdn.optimizelyassets.com');
          }
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.dist %>/',
            src: '**/*.html',
            dest: '<%= config.dist %>'
          }
        ]
      }
    },
    gitinfo: {}
  });

  grunt.registerTask('staging-deploy', [
    'gitinfo',
    'config:staging',
    'jshint:clientDev',
    'jshint:server',
    'clean:preBuild',
    'inline',
    'assemble',
    'concat',
    'uglify',
    'sass',
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
    'inline',
    'assemble',
    'concat',
    'uglify',
    'sass',
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
    'inline',
    'assemble',
    'handlebars',
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
    'concat',
    'copy:cssFontFile',
    'copy:jquery',
    'uglify',
    'sass:prod',
    'replace',
    'autoprefixer',
    'filerev',
    'userevvd',
    'clean:postBuild'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
