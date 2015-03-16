var path = require('path');
var ppcKey = 'om';

var config = {
  options: {
    layoutDir: '<%= config.guts %>/templates/layouts/**/*.hbs',
    assetsDir: '<%= grunt.config.get("assetsDir") %>',
    linkPath: '<%= grunt.config.get("link_path") %>',
    sassImagePath: '<%= grunt.config.get("sassImagePath") %>',
    environment: '<%= grunt.config.get("environment") %>',
    data: [
      '<%= config.content %>/**/*.json',
      //this is only one level deep intentionally
      '<%= config.content %>/*.yml',
      '<%= grunt.config.get("environmentData") %>'
    ],
    partials: ['<%= config.guts %>/templates/partials/*.hbs'],
    client: ['<%= config.guts %>/templates/client/**/*.hbs'],
    helpers: ['<%= config.helpers %>/**/*.js', 'helper-moment'],
    basename: path.basename(process.cwd()),
    websiteRoot: 'website',
    websiteGuts: '<%= config.guts %>',
    modalsDir: '<%= config.guts %>/templates/components/modals',
    pageContentNamespace: 'page_data',
    subfoldersRoot: 'subfolders',
    locales: {
      'de': 'de_DE',
      'fr': 'fr_FR',
      'es': 'es_ES',
      'jp': 'ja_JP'
    },
    ppcKey: ppcKey
  },
  modals: {
    options: {
      ext: '.hbs'
    },
    files: [
      {
        src: 'templates/components/modals/**/*.hbs',
        dest: '<%= config.guts %>/templates/partials/',
        cwd: '<%= config.guts %>/',
        expand: true,
        filter: 'isFile',
        flatten: true,
        rename: function(dest, src) {
          var split = src.split('.');
          return dest + split[0] + '_compiled';
        }
      }
    ]
  },
  resources: {
    options: {
      collections: [
        {
          name: 'resources',
          inflection: 'resource',
          sortby: 'priority',
          sortorder: 'descending'
        }
      ]
    },
    files: [
      {
        src: ['resources/resources-list/**/*.hbs'],
        dest: '<%= config.dist %>/',
        cwd: '<%= config.content %>/',
        expand: true
      }
    ]
  },
  partners: {
    options: {
      collections: [
        {
          name: 'integrations',
          inflection: 'integration',
          sortby: 'priority',
          sortorder: 'descending'
        },
        {
          name: 'solutions',
          inflection: 'solution',
          sortby: 'priority',
          sortorder: 'descending'
        }
      ]
    },
    files: [
      {
        src: ['partners/**/*.hbs'],
        dest: '<%= config.dist %>/',
        cwd: '<%= config.content %>/',
        expand: true
      }
    ]
  },
  pages: {
    files: [
      {
        src: ['**/*.hbs', '!resources/resources-list/**/*.hbs', '!om/**/*.hbs'],
        dest: '<%= config.dist %>/',
        cwd: '<%= config.content %>/',
        expand: true
      }
    ]
  }
};

config[ppcKey] = {
  options: {
    layoutdir: '<%= config.guts %>/templates/' + ppcKey + '/layouts/'
  },
  files: [
    {
      src: [ppcKey + '/**/*.hbs', '!<%= grunt.config.get("exclude_from_assemble") %>'],
      dest: '<%= config.dist %>/',
      cwd: '<%= config.content %>/',
      expand: true
    }
  ]
};

module.exports = config;
