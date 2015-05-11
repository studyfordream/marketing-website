var path = require('path');
var _ = require('lodash');
var webpack = require('webpack');
var trPlugin = require('l10n-tr-plugin');
var injectFilenamePath = path.join(process.cwd(), 'grunt/webpack/inject-filename-loader');
console.log('LOADER PATH => ', injectFilenamePath);

module.exports = function(opts) {
  var jshintConfig = _.merge({}, {
    emitErrors: true,
    failOnHint: true,
  }, opts.jshintConfig);

  var preloaders = [
    {
      test: /\.js$/,
      exclude: [
        /node_modules/,
        /bower_components/,
        /libraries/,
        /equal_height_grid/,
        /form-filler/,
        /guid_sprintf/,
        /oform_globals/,
        /trim-mixpanel-cookie/,
        /uri/,
        /get_url_parameter/
      ],
      loader: 'jshint-loader'
    }
  ];

  /**
   * Loaders to
   * -- compile hbs client side templates
   * -- compile es6
   */
  var loaders = [
    {
      test: /\.js$/,
      exclude: [
        /node_modules/,
        /bower_components/,
        /libraries/
      ],
      loader: injectFilenamePath + '?' + opts.injectFileNameParams
    },
    { test: /\.hbs$/, loader: 'handlebars-loader' },
    {test: /\.js?$/, exclude: ['bower_components', 'node_modules'], loader: 'babel-loader'}
  ];

  /**
   * Plugins to
   * -- resolve all bower components from the main file specified in module's bower.json
   * -- no assets are emitted containing errors http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
   */
  var plugins = [
    new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])),
    new webpack.NoErrorsPlugin()
    //new trPlugin()
  ];

  //TODO: Add webpack dev server for Hot Module Replacment
  var devPlugins = [
    //new webpack.HotModuleReplacementPlugin()
  ];

  /**
   * Plugins specific to production
   * -- Uglifiy JS and strip comments
   * -- Deduplicates equal or similar files http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
   * -- Defines a global production variable that can be used in JS if necessary
  */
  var prodPlugins = [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      //compress: {
        //conditionals: false,
        //warnings: false,
      //},
      sourceMap: false
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ];

  if(opts.env === 'dev') {
    plugins.push.apply(plugins, devPlugins);
  } else {
    plugins.push.apply(plugins, prodPlugins);
  }

  var webpackConfig = {
    node: {
      __filename: true
    },
    jshint: jshintConfig,
    entry: opts.entry,
    output: {
      path: './' + opts.outputPath,
      publicPath: opts.publicPath,
      filename: '[name].js'
    },
    resolve: {
      //all these extensions will be resolved without specifying extension in the `require` function
      extensions: ['', '.js', '.hbs'],
      //files in these directory can be required without a relative path
      modulesDirectories: [
        'node_modules',
        'bower_components',
        'website-guts/templates/client',
        'website-guts/assets/js/globals',
        'website-guts/assets/js/libraries'
      ]
    },
    //resolveLoader: {
      //modulesDirectories: ['loaders', 'node_modules'],
      //extensions: ['', '.loader.js', '.js']
    //},
    module: {
      preLoaders: preloaders,
      loaders: loaders
    },
    plugins: plugins
  };

  if(opts.env === 'dev') {
    webpackConfig.devtool = 'inline-source-map';
  }

  return webpackConfig;
};
