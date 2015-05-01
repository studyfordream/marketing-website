var path = require('path');
var fs = require('fs');

module.exports = function(grunt){
  return {
    prod: {
      options: {
        sourceMap: false,
        imagePath: '<%= grunt.config.get("sassImagePath") %>',
        precision: 3,
        outputStyle: 'compressed',
        includePaths: [
          path.join(process.cwd(), 'node_modules/css-smart-grid/sass')
        ]
      },
      files: [
        {
        src: '<%= config.guts %>/assets/css/styles.scss',
        dest: '<%= config.temp %>/css/styles.css'
      },
      {
        src: '<%= config.guts %>/assets/css/om/styles.scss',
        dest: '<%= config.temp %>/css/om/styles.css'
      }
      ]
    },
    dev: {
      options: {
        sourceMap: false,
        imagePath: '<%= grunt.config.get("sassImagePath") %>',
        precision: 3,
        includePaths: [
          path.join(process.cwd(), 'node_modules/css-smart-grid/sass')
        ],
        importer: function(url, prev, done) {
          var fp = path.join(path.dirname(prev), url + '.scss');
          var env, contents, imageUrl;
          //console.log('URL', url);
          //console.log('PREV', prev);

          if(/variables/.test(url)) {
            imageUrl = grunt.config.get('imageUrl');
            env = grunt.config.get('environment');
            contents = fs.readFileSync(fp, {encoding: 'utf8'});
            contents = '$imageUrl: ' + imageUrl+ ';\n\nbody {background: red}';
            return {contents: contents};
          } else {
            if(url = 'smart-grid') {
              console.log(url);
              //url = path.join(process.cwd(), 'node_modules/css-smart-grid/sass', url);
              url = path.join('smart-grid', url + '.scss');
              console.log(url);
            }
            return {file: url};
          }

        }
      },
      files: [
        {
        src: '<%= config.guts %>/assets/css/styles.scss',
        dest: '<%= config.temp %>/css/styles.css'
      },
      {
        src: '<%= config.guts %>/assets/css/om/styles.scss',
        dest: '<%= config.temp %>/css/om/styles.css'
      }
      ]
    }

  };
};
