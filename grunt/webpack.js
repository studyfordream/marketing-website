var webpack = require('webpack');
var path = require('path');

module.exports = function(grunt, options) {
  var basePath = 'website-guts/assets/js';
  var expandPath = function(basePath, dir) {
    return grunt.file.expand({cwd: basePath}, dir + '/*.js').reduce(function(map, filepath) {
      map[path.basename(filepath, '.js')] = './' + path.join(basePath, filepath);
      return map;
    }, {});
  };

  return {
    options: {
      stats: {
        colors: true,
        modules: true,
        reasons: true
      }
    },
    pages: {
      entry: expandPath(basePath, 'pages'),
      output: {
        path: './dist/assets/js/pages',
        filename: '[name].js',
        sourceMapFilename: '[file].map'
      },
      resolve: {
          extensions: ["", ".js", ".hbs"],
          modulesDirectories: ['node_modules', 'website-guts/templates/client']
      },
      module: {
        loaders: [
          { test: /\.hbs$/, loader: 'handlebars-loader' }
        ]
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        })
      ]
    },
    layouts: {
      entry: expandPath(basePath, 'layouts'),
      output: {
        path: './dist/assets/js/layouts',
        filename: '[name].js',
        sourceMapFilename: '[file].map'
      },
      resolve: {
          extensions: ["", ".js", ".hbs"],
          modulesDirectories: ['node_modules', 'website-guts/templates/client']
      },
      module: {
        loaders: [
          { test: /\.hbs$/, loader: 'handlebars-loader' }
        ]
      },
      plugins: "<%= grunt.config.get('plugins')%>"
    },
    globalBundle: {
      entry: './website-guts/assets/js/global.js',
      output: {
        path: './dist/assets/js',
        filename: 'bundle.js',
        sourceMapFilename: '[file].map'
      },
      resolve: {
          extensions: ["", ".js", ".hbs"],
          modulesDirectories: ['node_modules', 'bower_components', 'website-guts/templates/client']
      },
      module: {
        loaders: [
          { test: /\.hbs$/, loader: 'handlebars-loader' }
        ]
      },
      plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        })
      ]
    }
  }
};
