'use strict';

var ext = require('gulp-extname');
var through = require('through2');
var path = require('path');
var extend = require('extend-shallow');
var createStack = require('layout-stack');
var customSubfolders = require('./types/subfolders');
var es = require('event-stream');
var Plasma = require('plasma');
var _ = require('lodash');

module.exports = function (grunt) {

  grunt.registerTask('assemble', 'Assemble', function (target) {
    var done = this.async();
    var assemble = require('assemble');
    var localizeLinkPath = require('./middleware/localize-link-path');
    var mergeLayoutContext = require('./middleware/merge-layout-context');
    var collectionMiddleware = require('./middleware/onload-collection')(assemble);
    var mergeTranslatedData = require('./middleware/merge-translated-data');
    var renderTypeHelper = require('./helpers/render-type-helper')(assemble);
    var sendToSmartling = require('./plugins/smartling');
    var typeLoader = require('./loaders/type-loader');
    var push = require('assemble-push')(assemble);
    var assembleTasks = [
      'om-pages',
      'prep-smartling',
      'pages',
      'subfolders'
    ];

    var normalizeSrc = function normalizeSrc (cwd, sources) {
      sources = Array.isArray(sources) ? sources : [sources];
      return sources.map(function (src) {
        if (src[0] === '!') {
          return path.join('!' + cwd, src.substring(1));
        }
        return path.join(cwd, src);
      });
    };

    var config = grunt.config.get('_assemble'); // old assemble config
    var options = config.options; // global options
    var omLayouts = path.join(config.om.options.layoutdir, '**/*.hbs');
    var omFiles = config.om.files[0];
    var omSrc = normalizeSrc(omFiles.cwd, omFiles.src).filter(function(src) {
      if(src.indexOf('!') === -1) {
        return true;
      }
    })[0];
    var generateKey = require('./utils/generate-key');
    var renameKey = assemble.option('renameKey');
    var layoutPath = options.layoutDir.substring(0, options.layoutDir.indexOf('*') - 1);
    var ppcKey = options.ppcKey;

    if(target === 'test') {
      assemble.set('env', target);
      assembleTasks.splice(assembleTasks.length - 1);
    }

    //set the global data from external YML & env config
    //special key for YML data for translation dictionary retrieval
    assemble.data(options.data, {
      namespace: function(fp) {
        if(/global\_/.test(fp)) {
          return generateKey(fp);
        }
        return path.basename(fp, path.extname(fp));
      }
    });
    assemble.option('environment', options.environment);
    assemble.set('data.pageContentNamespace', options.pageContentNamespace);
    assemble.set('data.subfoldersRoot', options.subfoldersRoot);
    assemble.set('data.basename', options.basename);
    assemble.set('data.websiteGuts', options.websiteGuts);
    assemble.set('data.websiteRoot', options.websiteRoot);
    assemble.set('data.locales', options.locales);
    assemble.set('data.assetsDir', options.assetsDir);
    assemble.set('data.linkPath', options.linkPath);
    assemble.set('data.sassImagePath', options.sassImagePath);
    assemble.set('data.environmentIsProduction', options.environmentIsProduction);
    assemble.set('data.environmentIsDev', options.environmentIsDev);
    assemble.set('data.layoutPath', layoutPath);

    assemble.asyncHelper('partial', renderTypeHelper('partials'));
    assemble.layouts([options.layoutDir]);
    assemble.partials(options.partials, [typeLoader(assemble)]);
    assemble.helpers(options.helpers);

    //append special path for ppc layouts in order to prevent naming conflicts between layouts
    assemble.layouts([omLayouts], [function (layouts, options) {
      return Object.keys(layouts).reduce(function (o, key) {
        var layout = layouts[key];
        var concatKey = ppcKey + '-';
        if(layout.data && layout.data.layout) {
          layout.data.layout = concatKey + layout.data.layout;
        }

        o[concatKey + key] = layout;
        return o;
      }, {});
    }]);

    //load external YML files and scope locally, while omitting global YML
    assemble.transform('page-translations', require('./transforms/load-translations'), ['**/*.{yml,yaml}', '!**/global_*.{yml,yaml}'], options.websiteRoot);
    Object.keys(options.locales).forEach(assemble.transform.bind(assemble, 'subfolder-translations', require('./transforms/load-translations'), ['**/*.{yml,yaml}', '!**/global_*.{yml,yaml}']));

    //load the custom subolders
    customSubfolders(assemble, Object.keys(options.locales), process.env.lastRunTime);

    // create custom template type `modals`
    assemble.create('modal', 'modals', {
      isPartial: true,
      isRenderable: true
    });
    assemble.asyncHelper('modal', renderTypeHelper('modals'));

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

    //expose the partners pages takes on the root index partner page
    //for use in dropdown menu
    assemble.preRender(/partners\/solutions\/index/, function(file, next) {
      var col = assemble.get('solutions');
      var tags = Object.keys(col).reduce(function(map, key) {
        var o = col[key];
        if(_.isArray(o.tags)) {
          map.push.apply(map, o.tags);
        }
        return map;
      }, []);
      file.data.tags = _.uniq(tags).filter(function(tag) { return !!tag; });
      next();
    });

    //change the layout name reference to that created in the ppc layout loader
    var ppcRe = new RegExp(path.join(options.websiteRoot, ppcKey));
    assemble.onLoad(ppcRe, function(file, next) {
      file.data.isPpc = true;
      file.data.layout = ppcKey + '-' + file.data.layout;
      next();
    });

    //merge layout YFM on file context, attach external YML data and translate
    //order is important here because we want to merge layouts before translating
    assemble.preRender(/.*\.(hbs|html)$/, mergeLayoutContext(assemble));
    assemble.preRender(/.*\.(hbs|html)$/, mergeTranslatedData(assemble));

    //localize link path after locale is appended in the translate data middleware
    var pathRe = /^(([\\\/]?|[\s\S]+?)(([^\\\/]+?)(?:(?:(\.(?:\.{1,2}|([^.\\\/]*))?|)(?:[\\\/]*))$))|$)/;
    assemble.preRender(pathRe, localizeLinkPath(assemble));

    //load the modals
    var modalFiles = config.modals.files[0];
    assemble.modals(normalizeSrc(modalFiles.cwd, modalFiles.src), [typeLoader(assemble)]);

    //set rename key to longer format, fp without extension
    assemble.option('renameKey', function(fp) {
      return path.join(path.dirname(fp), path.basename(fp, path.extname(fp)));
    });

    //load the files for the resources collection
    var resourceFiles = config.resources.files[0];
    assemble.resources(normalizeSrc(resourceFiles.cwd, resourceFiles.src));


    var localesPaths = Object.keys(options.locales).reduce(function(map, locale) {
      map.push(path.join(options.subfoldersRoot, locale));
      return map;
    }, []);

    var allRoots = localesPaths.concat([
                        options.websiteRoot,
                        options.websiteGuts
                      ]);

    var hbsPaths = allRoots.reduce(function(map, root) {
                          var pattern = '**/*.hbs';
                          map.push(path.join(root, pattern));
                          return map;
                      }, [])
                      .concat([
                        '!' + options.client,
                        '!' + omSrc,
                        '!' + omLayouts
                      ]);

    assemble.task('om-pages', function () {
      var start = process.hrtime();
      var files = config[ppcKey].files[0];

      return assemble.src([omSrc])
        .pipe(ext())
        .pipe(assemble.dest(path.join(files.dest, ppcKey)))
        .on('end', function () {
          var end = process.hrtime(start);
          console.log('finished rendering pages om', end);
        });
    });

    assemble.task('prep-smartling', ['om-pages'], function () {
      var start = process.hrtime();

      return assemble.src(hbsPaths)
        .pipe(sendToSmartling(assemble))
        .on('end', function () {
          var end = process.hrtime(start);
          console.log('finished translating pages', end);
        });
    });

    assemble.task('pages', ['prep-smartling'], function () {
      var start = process.hrtime();

      var files = config.pages.files[0];
      var opts = {
        since: (process.env.lastRunTime ? new Date(process.env.lastRunTime) : null)
      };
      //this excludes om pages && resources-list pages
      return assemble.src(normalizeSrc(files.cwd, files.src).concat('!' + omSrc[0]), opts)
        .pipe(ext())
        .pipe(assemble.dest(files.dest))
        .on('end', function () {
          var end = process.hrtime(start);
          console.log('finished rendering pages', end);
        });
    });

    assemble.task('subfolders', ['pages'],  function () {
      var start = process.hrtime();
      var files = config.pages.files[0];

      /* jshint ignore:start */
      assemble['subfolder']({
        src: [
          '**/*.hbs',
          '!' + omSrc
        ],
        fallback: [ '**/*.hbs', '!resources/resources-list/**/*' ]
      });
      /* jshint ignore:end */
      return push('subfolders')
      .pipe(ext())
      .pipe(assemble.dest(files.dest))
      .on('data', function(d) {
        console.log('data', d.path);
      })
      .on('end', function () {
        var end = process.hrtime(start);
        console.log('finished rendering subfolder', end);
      });
    });

    assemble.run(assembleTasks, function (err) {
      if (err) {
        return done(err);
      }
      process.env.lastRunTime = new Date();
      done();
    });
  });
  return {};
};
