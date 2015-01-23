'use strict';
var ext = require('gulp-extname');
var through = require('through2');
var path = require('path');
var helpers = require('handlebars-helpers');

module.exports = function (grunt) {
  grunt.registerTask('assemble', 'Assemble', function () {
    var done = this.async();

    var assemble = require('assemble');
    var Handlebars = require('assemble/node_modules/engine-assemble/node_modules/engine-handlebars/node_modules/handlebars');

    var config = grunt.config.get('_assemble'); // old assemble config
    var options = config.options; // global options
    helpers.register(Handlebars, options);

    var renameKey = assemble.option('renameKey');
    assemble.data(options.data);

    assemble.set('data.assetsDir', options.assetsDir);
    assemble.set('data.linkPath', options.linkPath);
    assemble.set('data.sassImagePath', options.sassImagePath);
    assemble.set('data.environmentIsProduction', options.environmentIsProduction);
    assemble.set('data.environmentIsDev', options.environmentIsDev);

    assemble.set('data.layout_modals', [
      'signin_modal',
      'signup_modal',
      'create_experiment',
      'reset_password',
      'error_modal',
      'contact_sales'
    ]);


    assemble.layouts([options.layoutdir]);
    assemble.partials(options.partials);
    assemble.helpers(options.helpers);

    console.log('layouts', Object.keys(assemble.views.layouts).map(function (key) {
      return {
        key: key,
        path: assemble.views.layouts[key].path
      }
    }));

    function normalizeSrc (cwd, sources) {
      sources = Array.isArray(sources) ? sources : [sources];
      return sources.map(function (src) {
        if (src[0] === '!') {
          return path.join('!' + cwd, src.substring(1));
        }
        return path.join(cwd, src);
      });
    }

    assemble.create('modal', 'modals', {
      isPartial: true,
      isRenderable: true
    });

    var modalFiles = config.modals.files[0];
    assemble.modals(normalizeSrc(modalFiles.cwd, modalFiles.src));

    // assemble.task('modals', function () {
    //   assemble.option('renameKey', function (fp) {
    //     var basename = renameKey(fp);
    //     return basename.replace('_compiled', '');
    //   });

    //   var files = config.modals.files[0];
    //   return assemble.src(normalizeSrc(files.cwd, files.src))
    //     .pipe(through.obj(function (file, enc, cb) {
    //       file.path = path.join(path.dirname(file.path), path.basename(file.path, path.extname(file.path)) + '_compiled') + path.extname(file.path);
    //       this.push(file);
    //       cb();
    //     }))
    //     .pipe(assemble.dest(files.dest))
    //     on('error', function (err) {
    //       console.log('error', err);
    //     });
    // });

    assemble.task('resources', function () {
      assemble.option('renameKey', renameKey);
      assemble.partials(options.partials);

      assemble.option('renameKey', function (fp) {
        return fp.indexOf('resources-list') > -1 ? path.join('resources', path.dirname(fp)) : renameKey(fp);
      });

      var files = config.resources.files[0];
      return assemble.src(normalizeSrc(files.cwd, files.src))
        // .pipe(through.obj(function (file, enc, cb) {
        //   if (file.isNull()) {
        //     // console.log('null contents');
        //     file.contents = new Buffer('');
        //   }
        //   this.push(file);
        //   cb();
        // }))
        .pipe(ext())
        .pipe(assemble.dest(path.join(files.dest, 'resources')));
    });

    assemble.task('partners', ['resources'], function () {
      assemble.option('renameKey', renameKey);
      assemble.partials(options.partials);

      assemble.option('renameKey', function (fp) {
        return fp.indexOf('partners') > -1 ? path.join('partners', path.dirname(fp)) : renameKey(fp);
      });

      var files = config.partners.files[0];
      return assemble.src(normalizeSrc(files.cwd, files.src))
        .pipe(through.obj(function (file, enc, cb) {
          // console.log('partner file', file.data.layout);
          // console.log(typeof assemble.views.layouts[file.data.layout] !== 'undefined');
          this.push(file);
          cb();
        }))
        .pipe(ext())
        .pipe(assemble.dest(path.join(files.dest, 'partners')));
    });

    assemble.task('pages', ['partners'], function () {
      assemble.option('renameKey', renameKey);
      assemble.partials(options.partials);
      assemble.option('renameKey', function (fp) {
        return fp.indexOf('index') > -1 ? path.dirname(fp) : renameKey(fp);
      });

      var files = config.pages.files[0];
      return assemble.src(normalizeSrc(files.cwd, files.src))
        .pipe(through.obj(function (file, enc, cb) {
          this.push(file);
          cb();
        }))
        .pipe(ext())
        .pipe(assemble.dest(files.dest));
    });

    assemble.run(['resources', 'partners', 'pages'], done);
  });
  return {};
};
