var webpack = require('webpack');
var path = require('path');
var BannerFooterPlugin = require('banner-footer-webpack-plugin');

module.exports = function(grunt, options) {
  var basePath = 'website-guts/assets/js';
  var expandPath = function(basePath, dir) {
    return grunt.file.expand({cwd: basePath}, dir + '/*.js').reduce(function(map, filepath) {
      map[path.basename(filepath, '.js')] = './' + path.join(basePath, filepath);
      return map;
    }, {});
  };
  var sharedLoaders = [
    { test: /\.hbs$/, loader: 'handlebars-loader' },
    {test: /\.js?$/, exclude: ['bower_components', 'node_modules'], loader: '6to5-loader?experimental&runtime'}
  ];
  var sharedPlugins = [
    new webpack.ProvidePlugin({
      to5Runtime: 'imports?global=>{}!exports?global.to5Runtime!6to5/runtime'
    }),
    new BannerFooterPlugin('<%= grunt.config.get("concat_banner") %>', '<%= grunt.config.get("concat_footer") %>', {
      raw: true
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
      devtool: 'source-map',
      environment: '<%= grunt.config.get("environment") %>',
      envPlugins: [
        [
          '!dev',
          webpack.optimize.UglifyJsPlugin,
          [{compress: {warnings: false}}]
        ]
      ]
    },
    pages: {
      entry: expandPath(basePath, 'pages'),
      output: {
        path: './dist/assets/js/pages',
        filename: '[name].js'
      },
      resolve: {
          extensions: ["", ".js", ".hbs"],
          modulesDirectories: ['node_modules', 'website-guts/templates/client']
      },
      module: {
        loaders: sharedLoaders
      },
      plugins: sharedPlugins
    },
    layouts: {
      entry: expandPath(basePath, 'layouts'),
      output: {
        path: './dist/assets/js/layouts',
        filename: '[name].js'
      },
      resolve: {
          extensions: ["", ".js", ".hbs"],
          modulesDirectories: ['node_modules', 'website-guts/templates/client']
      },
      module: {
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
          extensions: ["", ".js", ".hbs"],
          modulesDirectories: ['node_modules', 'bower_components', 'website-guts/templates/client']
      },
      module: {
        loaders: sharedLoaders
      },
      plugins: addPlugins(
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
      )
    }
  }
};
