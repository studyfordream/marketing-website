var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var ProgressPlugin = require('webpack/lib/ProgressPlugin');
var path = require('path');
var _ = require('lodash');
var gutil = require('gulp-util');
var makeConfig = require('./make-webpack-config');
var jshintConfig = require('../jshint');
var serverJshintConfig = _.merge(jshintConfig.options, jshintConfig.server.options);

module.exports = function (grunt) {

  grunt.registerTask('webpack', 'Webpack', function () {
    var done = this.async();

    /**
     * Create the entry bundle
     *
     * ex = {
     *   'layouts/seo': './website-guts/assets/js/layouts/seo.js',
     *   'pages/android': './website-guts/assets/js/pagess/android.js'
     * };
     *
     * because bundle name (i.e. key) has a slash it gets dynamically written to that direcotry
     * by output: {filename: '[name].js'
     * Wrapping value in an array [ ] is a hack recommended by @sokra so multiple bundles
     * that may `require` from one another do not throw errors in the build.
     */
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
      outputPath: options.dest,
      publicPath: options.publicPath,
      jshintConfig: _.merge({}, jshintEnvConfig, serverJshintConfig),
      injectFileNameParams: [
        'inject=' + encodeURIComponent('var targetName = __filename.replace("website-guts/assets/js/", "");\n\n'),
        '&banner=' + encodeURIComponent(banner),
        '&footer=' + encodeURIComponent(footer)
      ].join('')
    };


    var webpackConfig = makeConfig(opts);
    var compiler = webpack(webpackConfig);
    var chars = 0;

    compiler.apply(new ProgressPlugin(function(percentage, msg) {
      if(percentage < 1) {
        percentage = Math.floor(percentage * 100);
        msg = percentage + '% ' + msg;
        if(percentage < 100) { msg = ' ' + msg; }
        if(percentage < 10) { msg = ' ' + msg; }
      }
      for(; chars > msg.length; chars--) {
        grunt.log.write('\b \b');
      }
      chars = msg.length;
      for(var i = 0; i < chars; i++) {
        grunt.log.write('\b');
      }
      grunt.log.write(msg);
    }));

    var handler = function handler(err, stats) {
      if(err) {
        grunt.log.error(err);
        return done(false);
      }

      grunt.log.notverbose.writeln(stats.toString(_.merge({
        colors: true,
        hash: false,
        timings: false,
        assets: true,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: true
      }, options.stats)));
      grunt.verbose.writeln(stats.toString(_.merge({
        colors: true
      }, options.stats)));
      if(!options.keepalive) {
        done();
        done = function(){};
      }
    };

    if (env === 'dev') {
      //TODO: Add webpack dev server for Hot Module Replacment here
      compiler.watch(options.watchDelay || 200, handler);
    } else {
      compiler.run(handler);
    }

  });

};
