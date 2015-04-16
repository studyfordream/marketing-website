var path = require('path');

module.exports = {
  compile: {
    options: {
      namespace: 'optly.mrkt.templates',
      processName: function(filePath){
        return filePath.replace(/^.*[\\\/]/, '').replace('.hbs', '');
      }
    },
    // compilerOptions: {
    //   knownHelpers: {
    //     'tr': require(path.join(process.cwd(), 'website-guts/helpers/helper.tr'))
    //   }
    // },
    files: {
      '<%= config.temp %>/assets/js/handlebarsTemplates.js': ['<%= config.guts %>/templates/client/**/*.hbs']
    }
  }
};
