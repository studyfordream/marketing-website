var _ = require('lodash');
var webpack = require('webpack');

module.exports = function(opts) {
  var jshintConfig = _.merge({}, {
    emitErrors: true,
    failOnHint: true,
  }, opts.jshintConfig);

  var preloaders = [
    {
      test: /\.js$/,
      exclude: [
        /node\_modules/,
        /bower\_components/,
        /libraries/,
        /form\-filler/,
        /global\.js/
      ],
      loader: 'inject-filename-loader?' + opts.injectFileNameParams
    },
    {
      test: /\.js$/,
      exclude: [
        /node\_modules/,
        /bower\_components/,
        /libraries/,
        /equal\_height\_grid/,
        /form\-filler/,
        /guid\_sprintf/,
        /oform\_globals/,
        /trim\-mixpanel\-cookie/,
        /uri/,
        /get\_url\_parameter/
      ],
      loader: 'jshint-loader'
    }
  ];

  var loaders = [
    { test: /\.hbs$/, loader: 'handlebars-loader' },
    {test: /\.js?$/, exclude: ['bower_components', 'node_modules'], loader: 'babel-loader'}
  ];

  var plugins = [
    new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])),
    new webpack.NoErrorsPlugin()
  ];

  //TODO: Add webpack dev server for Hot Module Replacment
  var devPlugins = [
    new webpack.HotModuleReplacementPlugin()
  ];

  var prodPlugins = [
    new webpack.optimize.UglifyJsPlugin({output: {comments: false}}),
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
      extensions: ['', '.js', '.hbs'],
      modulesDirectories: [
        'node_modules',
        'bower_components',
        'website-guts/templates/client',
        'website-guts/assets/js/globals',
        'website-guts/assets/js/libraries'
      ]
    },
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
