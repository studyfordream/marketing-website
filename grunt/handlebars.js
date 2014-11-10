module.exports = {
  compile: {
    options: {
      namespace: 'optly.mrkt.templates',
      processName: function(filePath){
        return filePath.replace(/^.*[\\\/]/, '').replace('.hbs', '');
      }
    },
    files: {
      '<%= config.temp %>/assets/js/handlebarsTemplates.js': ['<%= config.guts %>/templates/client/**/*.hbs']
    }
  }
};
