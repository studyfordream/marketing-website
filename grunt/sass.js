var path = require('path');

module.exports = {
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
  }
};
