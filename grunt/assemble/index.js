'use strict';
var ext = require('gulp-extname');
var through = require('through2');
var path = require('path');
var helpers = require('handlebars-helpers');
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

    customSubfolders(assemble, config.locales);

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
    assemble.onLoad(/\.hbs/, mergePageData(assemble));
    assemble.onLoad(/resources-list/, collectionMiddleware('resources'));
    assemble.onLoad(/partners\/solutions/, collectionMiddleware('solutions'));
    assemble.onLoad(/partners\/technology/, collectionMiddleware('integrations'));

    assemble.before(/\.hbs/, mergeLayoutContext(assemble));

    var pathRe = /^(([\\\/]?|[\s\S]+?)(([^\\\/]+?)(?:(?:(\.(?:\.{1,2}|([^.\\\/]*))?|)(?:[\\\/]*))$))|$)/;
    assemble.before(pathRe, localizeLinkPath(assemble));

    /****** This block for some reason needs to come after the middleware or get Warning: Object.keys called on non-object *********/
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
    /*******************************************************************************************************************************/

    // build the `resources` page
    assemble.task('resources', function () {
      var start = process.hrtime();
      //only the resources index file is rendered, all other resource-list
      //files are use purely for data to create the grid
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
      //all hbs files within partners are templated
      //the frontmatter data from individual partners files creates the grid
      //as well as renders individual pages
      //??? how does the markdown get parsed
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

      //resources seems to be happening successfully in here
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
