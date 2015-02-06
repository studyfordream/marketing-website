module.exports = function (assemble, base) {
  return function langLoader(args) {
    var fs = require('fs');
    var path = require('path');
    var globby = require('globby');
    var matter = require('gray-matter');
    var srcPattern = args.src;
    var fallbackPattern = args.fallback;
    var renameKey = assemble.option('renameKey');
    var srcFiles = globby.sync(srcPattern, {cwd: base});
    var fallbackFiles = globby.sync(fallbackPattern, {cwd: 'website'});

    var map = fallbackFiles.reduce(function(map, fp) {
      var langPath = path.join(base, fp);
      var key = renameKey(langPath);
      if (srcFiles.indexOf(fp) === -1) {
        map[key] = matter(fs.readFileSync('website/' + fp, 'utf8'));
        map[key].path = langPath;
      } else {
        map[key] = matter(fs.readFileSync(langPath, 'utf8'));
        map[key].path = langPath;
      }
      return map;
    }, {});

    //add loop for additional source files potentially look at keys
    return map;
  }
};
