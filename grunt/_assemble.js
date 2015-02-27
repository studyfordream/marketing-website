var path = require('path');

module.exports = {
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
    locales: [
      'website-de',
      'website-fr',
      'website-es',
      'website-jp'
    ],
    modals: [
      'error_modal',
      'reset_password',
      'create_experiment',
      'signup_modal',
      'signin_modal',
      'contact_sales',
      'negative_button_text',
      'nonprofits_video_modal',
      'pricing_plan_signup_thank_you',
      'downgrade_plan',
      'contact_sales_thank_you'
    ],
    modalYamlWhitelist: [
      'modal_title',
      'modal_sub_header',
      'primary_button_text',
      'negative_button_text',
      'hidden_button_text'
    ],
    layoutYamlWhitelist: [
      'faq_navigation',
      'menu_items'
    ]
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
