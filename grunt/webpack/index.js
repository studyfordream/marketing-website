var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var path = require('path');
var _ = require('lodash');
var gutil = require('gulp-util');
var makeConfig = require('./make-webpack-config');
var jshintConfig = require('../jshint');
var serverJshintConfig = _.merge(jshintConfig.options, jshintConfig.server.options);

module.exports = function (grunt) {

  grunt.registerTask('webpack', 'Webpack', function () {
    var done = this.async();

    var expandPath = function(basePath, dirs) {
      return grunt.file.expand({cwd: basePath}, dirs).reduce(function(map, filepath) {
        map[filepath.replace('.js', '')] = ['./' + path.join(basePath, filepath)];
        return map;
      }, {});
    };
    var config = grunt.config.get('_webpack');
    var options = config.options;
    var env = options.environment;
    var banner = options.banner;
    var footer = options.footer;

    var pages = expandPath(config.pages.cwd, config.pages.src);

    var globalBundle = {
      bundle: ['./' + config.globalBundle.cwd + config.globalBundle.src]
    };

    var entryBundle = _.merge({}, globalBundle, pages);

    var jshintEnvConfig = env === 'dev' ? jshintConfig.clientDev.options : jshintConfig.clientProd.options;

    var opts = {
      entry: entryBundle,
      env: env,
      publicPath: options.publicPath,
      jshintConfig: _.merge({}, jshintEnvConfig, serverJshintConfig),
      injectFileNameParams: [
        'inject=' + encodeURIComponent('var targetName = __filename.replace("website-guts/assets/js/", "");\n\n'),
        '&banner=' + encodeURIComponent(banner),
        '&footer=' + encodeURIComponent(footer)
      ].join('')
    };


    var webpackConfig = makeConfig(opts);

    if(false) {

     return new WebpackDevServer(webpack(webpackConfig), {
        contentBase: options.root,
        publicPath: options.publicPath,
        hot: true,
        stats: { colors: true }
      }).listen(8000, 'localhost', function (err, result) {
          if(err) {
            throw new gutil.PluginError('webpack-dev-server', err);
          }
          // Server listening
          gutil.log('[webpack-dev-server]', 'http://localhost:8000/webpack-dev-server/index.html');
          done();
      });
    } else {

      return webpack(webpackConfig, function(err, stats) {
          if(err) {
            throw new gutil.PluginError('webpack', err);
          }
          gutil.log('[webpack]', stats.toString({
             // output options
          }));

          done();
      });
    }

  });

};
