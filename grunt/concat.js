var secondLastSlash = function(path) {
  var split = path.split('/');

  return split.splice(split.length - 2).join('/');
};
module.exports = function(grunt, options){
  var lastTarget;
  var processBundleName = function (src, filepath) {
    var updatedSrc;
    if(lastTarget !== grunt.task.current.target) {
      updatedSrc = 'var targetName = "' + grunt.task.current.target + '";\n\n' + src;
    }
    lastTarget = grunt.task.current.target;

    return updatedSrc || src;
  };

  return {
    namespacePages: {
      options: {
        banner: '<%= grunt.config.get("concat_banner") %>',
        footer: '<%= grunt.config.get("concat_footer") %>',
        process: function(src, filepath) {
          return 'var targetName = "' + grunt.task.current.target + '" + "--" +  "' + secondLastSlash(filepath) + '";\n\n' + src;
        }
      },
      src: ['pages/*.js', 'layouts/*.js'],
      expand: true,
      cwd: '<%= config.guts %>/assets/js/',
      dest: '<%= config.dist %>/assets/js/'
    },
    namespaceOMPages: {
      options: {
        banner: '<%= grunt.config.get("concat_banner") %>',
        footer: '<%= grunt.config.get("concat_footer") %>',
        process: function(src, filepath) {
          return 'var targetName = "' + grunt.task.current.target + '" + "--" +  "' + secondLastSlash(filepath) + '";\n\n' + src;
        }
      },
      src: ['pages/*.js', 'layouts/*.js'],
      expand: true,
      cwd: '<%= config.guts %>/assets/js/om/',
      dest: '<%= config.dist %>/assets/js/om/'
    },
    jqueryModernizr: {
      src: [
        '<%= config.guts %>/assets/js/libraries/jquery-2.1.1.min.js',
        '<%= config.temp %>/assets/js/libraries/modernizr.2.8.3.min.js'
      ],
      expand: false,
      flatten: true,
      isFile: true,
      dest: '<%= config.dist %>/assets/js/libraries/jquery-modernizr.min.js'
    },
    omBundle: {
      options: {
        banner: '<%= grunt.config.get("concat_banner") %>',
        footer: '<%= grunt.config.get("concat_footer") %>',
        process: processBundleName
      },
      files: {
        '<%= config.dist %>/assets/js/om/bundle.js': [
          '<%= config.guts %>/assets/js/om/libraries/jquery.cookie.js',
          '<%= config.guts %>/assets/js/om/utils/get-url-parameter.js',
          '<%= config.guts %>/assets/js/om/utils/uri.js',
          '<%= config.guts %>/assets/js/om/services/source.js',
          '<%= config.guts %>/assets/js/om/utils/trim-url.js',
          '<%= config.guts %>/assets/js/om/utils/oform-globals.js',
          '<%= config.guts %>/assets/js/om/libraries/oform.min.js',
          '<%= config.guts %>/assets/js/om/global.js'
        ]
      }
    },
    jqueryModernizrOM: {
      src: [
        '<%= config.guts %>/assets/js/libraries/jquery-1.6.4.min.js',
        '<%= config.temp %>/assets/js/libraries/modernizr.2.8.3.min.js'
      ],
      expand: false,
      flatten: true,
      isFile: true,
      dest: '<%= config.dist %>/assets/js/libraries/jquery-modernizr-om.min.js'
    },
    globalBundle: {
      options: {
        banner: '<%= grunt.config.get("concat_banner") %>',
        footer: '<%= grunt.config.get("concat_footer") %>',
        process: processBundleName
      },
      files: {
        '<%= config.temp %>/assets/js/global.js': [
          '<%= config.guts %>/assets/js/utils/oform_globals.js',
          '<%= config.guts %>/assets/js/utils/check_complex_password.js',
          '<%= config.guts %>/assets/js/utils/equal_height_grid.js',
          '<%= config.guts %>/assets/js/utils/get_url_parameter.js',
          '<%= config.guts %>/assets/js/utils/uri.js',
          '<%= config.guts %>/assets/js/utils/guid_sprintf.js',
          '<%= config.guts %>/assets/js/utils/form_helper_factory.js',
          '<%= config.guts %>/assets/js/utils/form_helpers/*.js',
          '<%= config.guts %>/assets/js/utils/trim_url.js',
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
  }
};
