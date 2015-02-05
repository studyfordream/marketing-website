module.exports = function (base) {
  return function langLoader(args) {
    var fs = require('fs');
    var path = require('path');
    var globby = require('globby');
    var matter = require('gray-matter');
    var srcPattern = args.src;
    var fallbackPattern = args.fallback;

    var srcFiles = globby.sync(srcPattern, {cwd: base});
    var fallbackFiles = globby.sync(fallbackPattern, {cwd: 'website'});
    var o = {};

    fallbackFiles.forEach(function(fp) {

      if (srcFiles.indexOf(fp) === -1) {
        o[fp] = matter(fs.readFileSync('website/' + fp, 'utf8'));
        o[fp].path = path.join(base, fp);
        return;
      }

      o[fp] = matter(fs.readFileSync(path.join(base, fp), 'utf8'));
      o[fp].path = path.join(base,fp);
    });

    //add loop for additional source files potentially look at keys

    return o;
  }
};
