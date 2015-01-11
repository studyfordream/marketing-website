var webpack = require('webpack');

module.exports = function(grunt, options) {
  return {
    vendor: {
      entry: './website-guts/assets/js/vendor.js',
      output: {
        path: './build',
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
      module: {
        loaders: [
          { test: /\.js$/, loader: 'script' }
        ]
      },
      plugins: [
          new webpack.ResolverPlugin(
              new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
          )
      ]
    }, //end vendor target
    globalBundle: {
      entry: './website-guts/assets/js/global.js',
      output: {
        path: './build',
        filename: 'global.js'
      },
      stats: {
        colors: true,
        modules: true,
        reasons: true
      },
      resolve: {
          extensions: ["", ".js", ".hbs"],
          modulesDirectories: ['node_modules', 'bower_components']
      },
      module: {
        loaders: [
          { test: /\.hbs$/, loader: 'handlebars-loader?helpersDir=website-guts/templates/client/' }
        ]
      },
      plugins: [
          new webpack.ResolverPlugin(
              new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
          )
      ]
    }
  }
};
