var webpack = require('webpack');
var path = require('path');

module.exports = function(grunt, options) {
  var basePath = 'website-guts/assets/js';
  var expandPath = function(basePath, dir) {
    return grunt.file.expand({cwd: basePath}, dir + '/*.js').reduce(function(map, filepath) {
      map[filepath.replace('.js', '')] = './' + path.join(basePath, filepath);
      return map;
    }, {});
  };
  var sharedPreloaders = [
    {
      test: /\.js$/,
      exclude: [
        /node\_modules/,
        /bower\_components/,
        /form\-filler/,
        /global\.js/
      ],
      loader: 'inject-filename-loader?inject=' + encodeURIComponent('var targetName = __filename.replace("website-guts/assets/js/", "");\n\n')
    },
    {
      test: /\.js$/,
      exclude: [
        /node\_modules/,
        /bower\_components/,
        /equal\_height\_grid/,
        /form\-filler/,
        /guid\_sprintf/,
        /uri/,
        /get\_url\_parameter/
      ],
      loader: 'jshint-loader'
    }
  ];
  var sharedLoaders = [
    { test: /\.hbs$/, loader: 'handlebars-loader' },
    {test: /\.js?$/, exclude: ['bower_components', 'node_modules'], loader: '6to5-loader?experimental&runtime'}
  ];
  var sharedPlugins = [
    new webpack.ProvidePlugin({
      to5Runtime: 'imports?global=>{}!exports?global.to5Runtime!6to5/runtime'
    })
  ];
  function addPlugins(pluginInst) {
    var cloned = sharedPlugins.slice(0);
    cloned.unshift(pluginInst);
    return cloned;
  }

  return {
    options: {
      stats: {
        colors: true,
        modules: true,
        reasons: true
      },
      node: {
        __filename: true
      },
      jshint: {
        emitErrors: true,
        failOnHint: true,
        config: {
          src: require('./jshint'),
          tasks: {
            dev: ['clientDev', 'server'],
            staging: ['clientDev', 'server'],
            production: ['clientProd', 'server'],
          }
        }
      },
      watch: true,
      devtool: 'source-map',
      envPlugins: [
        [
          '!dev',
          webpack.optimize.UglifyJsPlugin,
          [{compress: {warnings: false}}]
        ]
      ]
    },
    locals: {
      entry: expandPath(basePath, '{pages,layouts}'),
      output: {
        path: './dist/assets/js',
        filename: '[name].js'
      },
      resolve: {
          extensions: ['', '.js', '.hbs'],
          modulesDirectories: ['node_modules', 'website-guts/templates/client', 'website-guts/assets/js/globals']
      },
      module: {
        preLoaders: sharedPreloaders,
        loaders: sharedLoaders
      },
      plugins: sharedPlugins
    },
    globalBundle: {
      entry: './website-guts/assets/js/global.js',
      output: {
        path: './dist/assets/js',
        filename: 'bundle.js'
      },
      resolve: {
          extensions: ['', '.js', '.hbs'],
          modulesDirectories: ['node_modules', 'bower_components', 'website-guts/templates/client', 'website-guts/assets/js/globals']
      },
      module: {
        preLoaders: sharedPreloaders,
        loaders: sharedLoaders
      },
      plugins: addPlugins(
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        )
      )
    }
  }
};
