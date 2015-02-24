'use strict';
var ext = require('gulp-extname');
var through = require('through2');
var path = require('path');
var extend = require('extend-shallow');
var createStack = require('layout-stack');
var customSubfolders = require('./types/subfolders');
var es = require('event-stream');
var Plasma = require('plasma');

module.exports = function (grunt) {

  grunt.registerTask('assemble', 'Assemble', function () {
    var done = this.async();

    var assemble = require('assemble');
    var localizeLinkPath = require('./middleware/localize-link-path');
    var mergeLayoutContext = require('./middleware/merge-layout-context');
    var collectionMiddleware = require('./middleware/onload-collection')(assemble);
    var mergePageData = require('./middleware/merge-page-data');
    var sendToSmartling = require('./plugins/smartling');
    var push = require('assemble-push')(assemble);

    var config = grunt.config.get('_assemble'); // old assemble config
    var options = config.options; // global options

    var renameKey = assemble.option('renameKey');
    var renameKeys = require('./utils/rename-keys')(renameKey);

    assemble.data(options.data);

    assemble.set('data.basename', options.basename);
    assemble.set('data.websiteRoot', options.websiteRoot);
    assemble.set('data.locales', options.locales);
    assemble.set('data.modalYamlWhitelist', options.modalYamlWhitelist);
    assemble.set('data.assetsDir', options.assetsDir);
    assemble.set('data.linkPath', options.linkPath);
    assemble.set('data.sassImagePath', options.sassImagePath);
    assemble.set('data.environmentIsProduction', options.environmentIsProduction);
    assemble.set('data.environmentIsDev', options.environmentIsDev);

    assemble.layouts([options.layoutdir]);
    assemble.partials(options.partials);
    assemble.helpers(options.helpers);

    assemble.transform('page-translations', require('./transforms/load-translations'), '**/*.{yml,yaml}', options.websiteRoot);
    options.locales.forEach(assemble.transform.bind(assemble, 'subfolder-translations', require('./transforms/load-translations'), '**/*.{yml,yaml}'));
    assemble.transform('modal-translations', require('./transforms/load-translations'), '**/*.hbs', options.modalsDir);

    function normalizeSrc (cwd, sources) {
      sources = Array.isArray(sources) ? sources : [sources];
      return sources.map(function (src) {
        if (src[0] === '!') {
          return path.join('!' + cwd, src.substring(1));
        }
        return path.join(cwd, src);
      });
    }

    customSubfolders(assemble, options.locales, process.env.lastRunTime);

    // create custom template type `modals`
    assemble.create('modal', 'modals', {
      isPartial: true,
      isRenderable: true
    });

    // create custom template type `resources`
    assemble.create('resource', 'resources', {
      isPartial: true,
      isRenderable: false,
    });

    // custom middleware for `resources` to add front-matter (`data`)
    // to the assemble cache. (`assemble.get('resources').foo`)
    assemble.onLoad(/resources-list/, collectionMiddleware('resources'));
    assemble.onLoad(/partners\/solutions/, collectionMiddleware('solutions'));
    assemble.onLoad(/partners\/technology/, collectionMiddleware('integrations'));

    //is this order dependent because we are merging page data for localization
    assemble.preRender(/\.hbs/, mergeLayoutContext(assemble));
    //will do merging of page data in plugin instead
    //assemble.preRender(/\.hbs/, mergePageData(assemble));

    var pathRe = /^(([\\\/]?|[\s\S]+?)(([^\\\/]+?)(?:(?:(\.(?:\.{1,2}|([^.\\\/]*))?|)(?:[\\\/]*))$))|$)/;
    assemble.preRender(pathRe, localizeLinkPath(assemble));

    var modalFiles = config.modals.files[0];
    assemble.modals(normalizeSrc(modalFiles.cwd, modalFiles.src));

    assemble.option('renameKey', renameKeys.noExtPath);

    var resourceFiles = config.resources.files[0];
    assemble.resources(normalizeSrc(resourceFiles.cwd, resourceFiles.src));



    assemble.task('prep-smartling', function () {
      var start = process.hrtime();

      var files = config.pages.files[0];
      return assemble.src(['**/*.hbs'])
        .pipe(sendToSmartling(assemble))
        .on('end', function () {
          var end = process.hrtime(start);
          console.log('finished rendering pages', end);
        });
    });

    assemble.task('pages', function () {
      var start = process.hrtime();
      //assemble.option('renameKey', renameKeys.dirnamePageKey('website'));

      var files = config.pages.files[0];
      var opts = {
        since: (process.env.lastRunTime ? new Date(process.env.lastRunTime) : null)
      };
      return assemble.src(normalizeSrc(files.cwd, files.src), opts)
        .pipe(require('./plugins/smartling')(assemble))
        .pipe(ext())
        .pipe(assemble.dest(files.dest))
        //.on('data', function (file) {
           //console.log(file.path, 'rendered');
        //})
        .on('end', function () {
          var end = process.hrtime(start);
          console.log('finished rendering pages', end);
        });
    });

    assemble.task('subfolders', ['pages'], function () {
      var start = process.hrtime();
      var files = config.pages.files[0];

      //resources seems to be happening successfully in here
      //assemble.option('renameKey', renameKeys.dirnameLangKey(config.locales));
      /* jshint ignore:start */
      assemble['subfolder']({
        src: [ '**/*.hbs' ],
        fallback: [ '**/*.hbs', '!resources/resources-list/**/*' ]
      });
      /* jshint ignore:end */
      return push('subfolders')
      .pipe(require('./plugins/smartling')(assemble))
      .pipe(ext())
      .pipe(assemble.dest(files.dest))
      //.on('data', function (file) {
         //console.log(file.path, 'rendered');
      //})
      .on('end', function () {
        var end = process.hrtime(start);
        console.log('finished rendering pages-de', end);
      });
    });

    assemble.task('copy', ['subfolders'], function () {
      var streams = [assemble.src('dist/partners/**/*.html', {minimal: true})];
      config.locales.forEach(function (locale) {
        streams = streams.concat(assemble.dest('dist/' + locale + '/partners', {minimal: true}));
      });
      return es.pipe.apply(es, streams);
    });

    assemble.run(['pages', 'subfolders'], function (err) {
    // assemble.run(['prep-smartling'], function (err) {
      if (err) {
        return done(err);
      }
      process.env.lastRunTime = new Date();
      done();
    });
  });
  return {};
};
