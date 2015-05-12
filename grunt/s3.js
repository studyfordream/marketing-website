module.exports = {
  options: {
    key: '<%= aws.key %>',
    secret: '<%= aws.secret %>',
    access: 'public-read'
  },
  staging: {
    options: {
      bucket: '<%= grunt.config.get("aws.staging_bucket") %>'
    },
    upload: [
      {
        src: '<%= config.dist %>/**/*',
        dest: '<%= grunt.option("branch") || gitinfo.local.branch.current.name %>',
        rel: '<%= config.dist %>'
      }
    ]
  },
  production: {
    options: {
      bucket: '<%= grunt.config.get("aws.production_bucket") %>'
    },
    upload: [
      {
        src: '<%= config.dist %>/**/*',
        dest: '',
        rel: '<%= config.dist %>'
      }
    ]
  },
  smartling: {
    options: {
      bucket: '<%= grunt.config.get("aws.smartling_staging_bucket") %>'
    },
    upload: [
      {
        src: '<%= config.dist %>/**/*',
        dest: '',
        rel: '<%= config.dist %>'
      }
    ]
  }
};
