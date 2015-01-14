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
    pages: {
      entry: expandPath(basePath, 'pages'),
      output: {
        path: './dist/assets/js/pages',
        filename: '[name].js'
      },
      resolve: {
          extensions: ["", ".js", ".hbs"],
          modulesDirectories: ['node_modules', 'bower_components', 'website-guts/templates/client']
      },
      module: {
        loaders: [
          { test: /\.hbs$/, loader: 'handlebars-loader?helpersDir=website-guts/templates/client' }
        ]
      },
    },
    layouts: {
      entry: expandPath(basePath, 'layouts'),
      output: {
        path: './dist/assets/js/layouts',
        filename: '[name].js'
      },
      resolve: {
          extensions: ["", ".js", ".hbs"],
          modulesDirectories: ['node_modules', 'bower_components', 'website-guts/templates/client']
      },
      module: {
        loaders: [
          { test: /\.hbs$/, loader: 'handlebars-loader?helpersDir=website-guts/templates/client' }
        ]
      }
    },
    vendor: {
      entry: './website-guts/assets/js/vendor.js',
      output: {
        path: './dist/assets/js',
        filename: 'vendor.js'
      },
      stats: {
        colors: true,
        modules: true,
        reasons: true
      },
     resolve: {
          extensions: ["", ".js"],
          modulesDirectories: ['node_modules', 'bower_components']
      },
      /*module: {*/
        //loaders: [
          //{ test: /\.js$/, loader: 'script' }
        //]
      /*},*/
      plugins: [
          new webpack.ResolverPlugin(
              new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
          )
      ]
    }, //end vendor target
    globalBundle: {
      entry: './website-guts/assets/js/global.js',
      output: {
        path: './dist/assets/js',
        filename: 'bundle.js'
      },
      stats: {
        colors: true,
        modules: true,
        reasons: true
      },
      resolve: {
          extensions: ["", ".js", ".hbs"],
          modulesDirectories: ['node_modules', 'website-guts/templates/client']
      },
      module: {
        loaders: [
          { test: /\.hbs$/, loader: 'handlebars-loader?helpersDir=website-guts/templates/client' }
        ]
      }
    }
  }
};
