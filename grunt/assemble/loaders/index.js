var fs = require('fs');
var path = require('path');
var globby = require('globby');
var matter = require('gray-matter');

module.exports = function (assemble, base) {
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
    var srcPattern = args.src;
    var fallbackPattern = args.fallback;
    var srcFiles = globby.sync(srcPattern, {cwd: base});
    var fallbackFiles = globby.sync(fallbackPattern, {cwd: 'website'});

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

    return map;
  };
};
