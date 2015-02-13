var path = require('path');


module.exports = function(assemble) {
  var Plasma = require('plasma');
  var yaml = require('js-yaml');
  var globby = require('globby');
  var fs = require('fs');
  var Type = yaml.Type;
  var marked = require('optimizely-marked');

  var TrType = new Type('tag:yaml.org,2002:tr', {
    kind: 'scalar',
    construct: function (data) {
      var translation = null !== data ? data : '';
      translation.isTR = true;
      //connect i18n parser here
      console.log('TR running *********');
      return translation;
    }
  });

  var MdType = new Type('tag:yaml.org,2002:md', {
    kind: 'scalar',
    construct: function (data) {
      marked.setOptions({
        linkPath: assemble.get('data.linkPath'),
        smartypants: true
      });
      var content = marked(null !== data ? data : '');
      content.isTR = true;
      console.log('md running******');
      return content;
    }
  });

  var SPACE_SCHEMA = yaml.Schema.create([ TrType, MdType ]);

  //scope data locally and potentially perform translation related dictionary creation
  var plasma = new Plasma();
  return function mergePageData (file, next) {
    // pageData.about
    var key = path.dirname(file.path);
    var yamlFiles = globby.sync('*.{yaml,yml}', {cwd: key});
    yamlFiles.forEach(function(yamlfile) {
      var loaded;
      if(/modal/.test(yamlfile)) {
        loaded = yaml.load( fs.readFileSync(path.join(key, yamlfile), 'utf8'), { schema: SPACE_SCHEMA } );
        console.log(file);
      }
    });
    var data = plasma.load([path.join(key, '*.{json,yaml,yml}')]);
    //if (data) {
    ////console.log('plasma data', data);
    //}

    // extend(file.data, data);
    next();
  };
};
