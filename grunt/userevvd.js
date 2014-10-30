module.exports = {
  html: {
    options: {
      formatOriginalPath: function(path){
        return '/' + path;
      },
      formatNewPath: function(path){
        return path.replace(/^dist\/assets/, '//du7782fucwe1l.cloudfront.net');
      }
    },
    files: [
      {
        expand: true,
        cwd: '<%= config.dist %>/',
        src: '**/*.html',
        dest: '<%= config.dist %>'
      }
    ]
  }
};
