module.exports = {
  options: {
    repository: 'optimizely/marketing-website',
    release: {
      tag_name: '<%= marketingDistName %>',
      name: '<%= marketingDistName %>',
      body: 'Website packaged at <%= dateVar %>'
    }
  },
  files: {
    src: ['temp/<%= marketingDistName %>.tar.gz']
  }
};
