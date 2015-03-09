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

  grunt.registerTask('assemble', 'Assemble', function (target) {
    var done = this.async();

    var assemble = require('assemble');
    var localizeLinkPath = require('./middleware/localize-link-path');
    var mergeLayoutContext = require('./middleware/merge-layout-context');
    var collectionMiddleware = require('./middleware/onload-collection')(assemble);
    var mergeTranslatedData = require('./middleware/merge-translated-data');
    var sendToSmartling = require('./plugins/smartling');
    var push = require('assemble-push')(assemble);

    var config = grunt.config.get('_assemble'); // old assemble config
    var options = config.options; // global options

    var renameKey = assemble.option('renameKey');
    var renameKeys = require('./utils/rename-keys')(renameKey);
    var layoutPath = options.layoutDir.substring(0, options.layoutDir.indexOf('*') - 1);

    assemble.data(options.data);

    assemble.option('environment', options.environment);
    assemble.set('data.basename', options.basename);
    assemble.set('data.websiteRoot', options.websiteRoot);
    assemble.set('data.locales', options.locales);
    assemble.set('data.modalYamlWhitelist', options.modalYamlWhitelist);
    assemble.set('data.layoutYamlWhitelist', options.layoutYamlWhitelist);
    assemble.set('data.assetsDir', options.assetsDir);
    assemble.set('data.linkPath', options.linkPath);
    assemble.set('data.sassImagePath', options.sassImagePath);
    assemble.set('data.environmentIsProduction', options.environmentIsProduction);
    assemble.set('data.environmentIsDev', options.environmentIsDev);
    assemble.set('data.layoutPath', layoutPath);

    assemble.layouts([options.layoutDir]);
    assemble.partials(options.partials);
    assemble.helpers(options.helpers);

    assemble.transform('page-translations', require('./transforms/load-translations'), '**/*.{yml,yaml}', options.websiteRoot);
    options.locales.forEach(assemble.transform.bind(assemble, 'subfolder-translations', require('./transforms/load-translations'), '**/*.{yml,yaml}'));
    assemble.transform('modal-translations', require('./transforms/load-translations'), '**/*.hbs', options.modalsDir);
    assemble.transform('layout-translations', require('./transforms/load-translations'), '**/*.hbs', layoutPath);

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
    var pathRe = /^(([\\\/]?|[\s\S]+?)(([^\\\/]+?)(?:(?:(\.(?:\.{1,2}|([^.\\\/]*))?|)(?:[\\\/]*))$))|$)/;
    assemble.preRender(pathRe, localizeLinkPath(assemble));
    assemble.preRender(/.*\.(hbs|html)$/, mergeLayoutContext(assemble));
    assemble.preRender(/.*\.(hbs|html)$/, mergeTranslatedData(assemble));

    var modalFiles = config.modals.files[0];
    assemble.modals(normalizeSrc(modalFiles.cwd, modalFiles.src));

    assemble.option('renameKey', renameKeys.noExtPath);

    var resourceFiles = config.resources.files[0];
    assemble.resources(normalizeSrc(resourceFiles.cwd, resourceFiles.src));

    var allRoots = options.locales.concat([
                        options.websiteRoot,
                        options.websiteGuts
                      ]);

    var hbsPaths = allRoots.reduce(function(map, root) {
                          var pattern = '**/*.hbs';
                          map.push(path.join(root, pattern));
                          return map;
                      }, []);

    assemble.task('prep-smartling', function () {
      var start = process.hrtime();

      return assemble.src(hbsPaths.concat(['!' + options.client]))
        .pipe(sendToSmartling(assemble))
        .on('end', function () {
          var end = process.hrtime(start);
          console.log('finished translating pages', end);
        });
    });

    assemble.task('pages', ['prep-smartling'], function () {
      var start = process.hrtime();
      //assemble.option('renameKey', renameKeys.dirnamePageKey('website'));

      var files = config.pages.files[0];
      var opts = {
        since: (process.env.lastRunTime ? new Date(process.env.lastRunTime) : null)
      };
      return assemble.src(normalizeSrc(files.cwd, files.src), opts)
        .pipe(ext())
        .pipe(assemble.dest(files.dest))
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
      .pipe(ext())
      .pipe(assemble.dest(files.dest))
      .on('end', function () {
        var end = process.hrtime(start);
        console.log('finished rendering pages-de', end);
      });
    });

    assemble.run(['prep-smartling', 'pages'], function (err) {
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
