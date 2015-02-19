var path = require('path');

var secondLastSlash = function(path) {
  var split = path.split('/');

  return split.splice(split.length - 2).join('/');
};

/*
  Generates concate bundle array to ensure proper ordering
 *
 * @param {Array}  -  array of paths to concat with string '<%= config.guts %>/assets/js/'
 * @param {Array}  - array of paths to exclude from concat bundle
 * @param {string} - prefix to include in path such as 'om'
 * @returns
 */

var makeBundlePaths = function makeBundlePaths(pathsArr, excludePaths, prefix) {
  var excludePathsMap;
  var _mapPaths = function _mapPaths(paths, exclude) {
    return paths.reduce(function(map, jsPath) {
      var concatPath = path.join((exclude ? '!' : '') + '<%= config.guts %>/assets/js/', (prefix ? prefix  : ''), jsPath);
      map.push(concatPath);
      return map;
    }, []);
  }
  var pathsMap = _mapPaths(pathsArr);

  if(excludePaths.length > 0) {
    return pathsMap.concat( _mapPaths(excludePaths, true) );
  } else {
    return _mapPaths(pathsArr);
  }
};

var omBundlePaths = [
  'libraries/jquery.cookie.js',
  'utils/get-url-parameter.js',
  'utils/uri.js',
  'utils/trim-mixpanel-cookie.js',
  'services/source.js',
  'utils/trim-url.js',
  'utils/oform-globals.js',
  'libraries/oform.min.js',
  'global.js'
];

var omExcludeBundlePaths = [];

var bundlePaths = [
  'utils/oform_globals.js',
  'utils/check_complex_password.js',
  'utils/equal_height_grid.js',
  'utils/get_url_parameter.js',
  'utils/uri.js',
  'utils/trim-mixpanel-cookie.js',
  'utils/guid_sprintf.js',
  'utils/form_helper_factory.js',
  'utils/form_helpers/*.js',
  'utils/trim_url.js',
  'global.js',
  'components/*.js',
  'services/*.js'
];

var excludeBundlePaths = [
  'services/user_state.js'
];

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
        '<%= config.dist %>/assets/js/om/bundle.js': makeBundlePaths(bundlePaths, omExcludeBundlePaths, 'om')
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
        '<%= config.temp %>/assets/js/global.js': makeBundlePaths(bundlePaths, excludeBundlePaths)
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
