var fs = require('fs');
var path = require('path');
var globby = require('globby');
var matter = require('gray-matter');
var _ = require('lodash');

module.exports = function (assemble, locales) {
  function createMap(argsObj) {
    var renameKey = assemble.option('renameKey');
    var langPath = argsObj.langPath;
    var readPath = argsObj.readPath;
    var map = argsObj.map;
    var key = renameKey(langPath);
    map[key] = matter(fs.readFileSync(readPath || langPath, 'utf8'));
    map[key].path = langPath;
    return map;
  }

  return function langLoader(args) {
    var collection = {};
    var srcPattern = args.src;
    var fallbackPattern = args.fallback;
    // collect an object with locale key mapping to all files for locale
    var localesCollection = locales.reduce(function(o, locale) {
      o[locale] = globby.sync(srcPattern, {cwd: locale});
      return o;
    }, {});
    var fallbackFiles = globby.sync(fallbackPattern, {cwd: 'website'});

    _.forEach(localesCollection, function(srcFiles, base) {
      //assemble.option('renameKey', dirnameLangKey(base));
      var map = fallbackFiles.reduce(function(map, fp) {
        var readPath;

        if (srcFiles.indexOf(fp) === -1) {
          readPath = 'website/' + fp;
        } else {
          srcFiles.splice(srcFiles.indexOf(fp), 1);
        }

        return createMap({
          map: map,
          readPath: readPath,
          langPath: path.join(base, fp)
        });
      }, {});

      //add loop for additional custom source files
      srcFiles.forEach(function(fp) {
        createMap({
          map: map,
          langPath: path.join(base, fp)
        });
      });

      _.extend(collection, map);

    });

    return collection;
  };
};
