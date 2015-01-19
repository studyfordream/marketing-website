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
        new BannerFooterPlugin('<%= grunt.config.get("concat_banner") %>', '<%= grunt.config.get("concat_footer") %>', {
          raw: true
        }),
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
      plugins: [
        new BannerFooterPlugin('<%= grunt.config.get("concat_banner") %>', '<%= grunt.config.get("concat_footer") %>', {
          raw: true
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        })
      ]
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
        new BannerFooterPlugin('<%= grunt.config.get("concat_banner") %>', '<%= grunt.config.get("concat_footer") %>', {
          raw: true
        })
      ]
    }
  }
};
