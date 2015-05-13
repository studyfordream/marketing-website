module.exports = {
  options: {
    key: '<%= secret.aws_key %>',
    secret: '<%= secret.aws_secret %>',
    access: 'public-read'
  },
  staging: {
    options: {
      bucket: '<%= secret.s3_bucket %>'
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
      bucket: '<%= secret.s3_bucket %>'
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
      bucket: '<%= secret.smartling_bucket %>'
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
