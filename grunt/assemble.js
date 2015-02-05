module.exports = {
  options: {
    layoutdir: '<%= config.guts %>/templates/layouts/',
    assetsDir: '<%= grunt.config.get("assetsDir") %>',
    linkPath: '<%= grunt.config.get("link_path") %>',
    sassImagePath: '<%= grunt.config.get("sassImagePath") %>',
    environmentIsProduction: '<%= grunt.config.get("environmentIsProduction") %>',
    environmentIsDev: '<%= grunt.config.get("environmentIsDev") %>',
    data: ['<%= config.content %>/**/*.json', '<%= config.content %>/**/*.yml', '<%= grunt.config.get("environmentData") %>'],
    partials: ['<%= config.guts %>/templates/partials/*.hbs'],
    helpers: ['<%= config.helpers %>/**/*.js', 'helper-moment'],
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
        src: ['resources/resources-list/**/*.hbs', 'resources/index.hbs'],
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
        src: ['**/*.hbs', '!partners/**/*.hbs', '!resources/resources-list/**/*.hbs', '!resources/index.hbs', '!om/**/*.hbs'],
        dest: '<%= config.dist %>/',
        cwd: '<%= config.content %>/',
        expand: true
      }
    ]
  },
  om: {
    options: {
      layoutdir: '<%= config.guts %>/templates/om/layouts/'
    },
    files: [
      {
        src: ['om/**/*.hbs', '!<%= grunt.config.get("exclude_from_assemble") %>'],
        dest: '<%= config.dist %>/',
        cwd: '<%= config.content %>/',
        expand: true
      }
    ]
  }
};
