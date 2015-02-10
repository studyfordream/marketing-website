'use strict';
var ext = require('gulp-extname');
var through = require('through2');
var path = require('path');
var helpers = require('handlebars-helpers');
var extend = require('extend-shallow');
var createStack = require('layout-stack');
var customTypes = require('./types/page-de');
var es = require('event-stream');
var Plasma = require('plasma');

module.exports = function (grunt) {
  grunt.registerTask('assemble', 'Assemble', function () {
    var done = this.async();

    var assemble = require('assemble');
    var push = require('assemble-push')(assemble);
    var Handlebars = require('handlebars');

    var config = grunt.config.get('_assemble'); // old assemble config
    var options = config.options; // global options
    helpers.register(Handlebars, options);

    var renameKey = assemble.option('renameKey');
    var dirnameKey = function (search) {
      return function (fp) {
        if (fp.indexOf(search) > -1) {
          var segments = path.dirname(fp).split('/');
          return segments[segments.length - 1];
        }
        return renameKey(fp);
      };
    };
    var dirnamePageKey = function (search) {
      return function (fp) {
        // fp => website/about/index.hbs
        if (fp.indexOf(search + '/') > -1 && fp.indexOf(search + '/index') === -1) {
            var segments = path.dirname(fp).split('/');
            return segments[segments.length - 1];
          }
          return renameKey(fp);
        };
    };
    var dirnameLangKey = function (locales) {
      return function (fp) {
        var key;
        var base = fp.substr(0, fp.indexOf('/'));
        //locales.forEach(function(locale) {
          //var re = new RegExp(locale);
          //if(re.test(fp)) {
            //base = locale;
          //}
        //});
        // fp => website/about/index.hbs
        if (fp.indexOf(base + '/') > -1 && fp.indexOf(base + '/index') === -1) {
          key = fp.substr(0, fp.lastIndexOf('/'));
        } else {
          key = path.join(base, path.basename(fp).replace(path.extname(fp), ''));
        }
        return key;
      };
    };

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

    customTypes(assemble, config.locales);

    //assemble.option('renameKey', dirnameLangKey('website-de'));

    // assemble.option('renameKey', dirnameLangKey('website'));

    // assemble.pages(
    //   ['website/**/*.hbs']);
    // console.log(Object.keys(assemble.views.pages));

    // var indexPage = assemble.findRenderable('index', ['page-des', 'pages']);
    // console.log(indexPage.render());

    assemble.layouts([options.layoutdir]);
    assemble.partials(options.partials);
    assemble.helpers(options.helpers);

    function normalizeSrc (cwd, sources) {
      sources = Array.isArray(sources) ? sources : [sources];
      return sources.map(function (src) {
        if (src[0] === '!') {
          return path.join('!' + cwd, src.substring(1));
        }
        return path.join(cwd, src);
      });
    }

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

    var collectionMiddleware = function (collection) {
      return function (file, next) {
        if (!file.data[collection]) {
          return next();
        }
        var col = assemble.get(collection) || {};
        var key = assemble.option('renameKey')(file.path);
        col[key] = extend({}, col[key], file.data);
        assemble.set(collection, col);
        next();
      };
    };

    // transform the layout front matter into an object
    // that `layout-stack` requires
    var mapLayouts = function (layouts) {
      return Object.keys(layouts).reduce(function (acc, key) {
        acc[key] = layouts[key].data;
        return acc;
      }, {});
    };

    // middleware to merge the layout context into the current page context
    var mergeLayoutContext = function (file, next) {
      var layout = file.layout || file.options.layout || file.data.layout;
      // => partners
      var layouts = mapLayouts(assemble.views.layouts);
      // => layout frontmatter

      var stack = createStack(layout, layouts, assemble.options);
      // => ['wrapper', 'partners']

      var data = {};
      var name = null;
      /* jshint ignore:start */
      while (name = stack.shift()) {
        extend(data, layouts[name]);
      }
      /* jshint ignore:end */
      extend(data, file.data);

      file.data = data;
      next();
    };

    var plasma = new Plasma();
    var mergePageData = function (file, next) {
      // pageData.about
      var key = path.dirname(file.path);
      var data = plasma.load([path.join(key, '*.{json,yaml,yml}')]);
      if (data) {
        console.log('plasma data', data);
      }

      // extend(file.data, data);
      next();
    };

    // custom middleware for `resources` to add front-matter (`data`)
    // to the assemble cache. (`assemble.get('resources').foo`)
    assemble.onLoad(/resources/, mergePageData);
    assemble.onLoad(/resources-list/, collectionMiddleware('resources'));
    assemble.onLoad(/partners\/solutions/, collectionMiddleware('solutions'));
    assemble.onLoad(/partners\/technology/, collectionMiddleware('integrations'));
    assemble.before(/\.hbs/, mergeLayoutContext);

    var pathRe = /^(([\\\/]?|[\s\S]+?)(([^\\\/]+?)(?:(?:(\.(?:\.{1,2}|([^.\\\/]*))?|)(?:[\\\/]*))$))|$)/;
    assemble.before(pathRe, function (file, next) {
      var dirname = file.options.params[1];
      dirname = dirname.replace(process.cwd(), '');

      var locale = dirname.split('/')[0];
      file.data.linkPath = assemble.get('data.linkPath');
      if (locale && locale.length && locale !== 'website') {
        file.data.linkPath += ('/' + locale);
      }
      next();
    });

    // load `modal` templates
    var modalFiles = config.modals.files[0];
    assemble.modals(normalizeSrc(modalFiles.cwd, modalFiles.src));

    // use a custom `renameKey` method when loading `resources`
    assemble.option('renameKey', dirnameKey('resources-list'));

    // load `resource` templates
    var resourceFiles = config.resources.files[0];
    assemble.resources(normalizeSrc(resourceFiles.cwd, resourceFiles.src));

    // reset the `renameKey` method
    assemble.option('renameKey', renameKey);

    // build the `resources` page
    assemble.task('resources', function () {
      var start = process.hrtime();
      var files = config.resources.files[0];
      return assemble.src('website/resources/index.hbs')
        .pipe(ext())
        .pipe(assemble.dest(path.join(files.dest, 'resources')))
        .on('data', function (file) {
          //console.log(file.path, 'rendered');
        })
        .on('end', function () {
          var end = process.hrtime(start);
          console.log('finished rendering resources', end);
        });
    });

    assemble.task('partners', ['resources'], function () {
      var start = process.hrtime();
      assemble.option('renameKey', dirnameKey('partners'));

      var files = config.partners.files[0];
      return assemble.src(normalizeSrc(files.cwd, files.src))
        .pipe(ext())
        .pipe(assemble.dest(path.join(files.dest, 'partners')))
        .on('data', function (file) {
          // console.log(file.path, 'rendered');
        })
        .on('end', function () {
          var end = process.hrtime(start);
          console.log('finished rendering partners', end);
        });
    });

    assemble.task('pages', ['partners'], function () {
      var start = process.hrtime();
      assemble.option('renameKey', dirnamePageKey('website'));

      var files = config.pages.files[0];
      return assemble.src(normalizeSrc(files.cwd, files.src))
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

      assemble.option('renameKey', dirnameLangKey(config.locales));
      /* jshint ignore:start */
      assemble['subfolder']({
        src: [ '**/*.hbs' ],
        fallback: [ '**/*.hbs', '!partners/**/*.hbs', '!resources/resources-list/**/*' ]
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

    assemble.task('copy', ['subfolders'], function () {
      var streams = [assemble.src('dist/partners/**/*.html', {minimal: true})];
      config.locales.forEach(function (locale) {
        streams = streams.concat(assemble.dest('dist/' + locale + '/partners', {minimal: true}));
      });
      return es.pipe.apply(es, streams);
    });

    assemble.run(['resources', 'partners', 'pages', 'subfolders', 'copy'], done);
  });
  return {};
};
