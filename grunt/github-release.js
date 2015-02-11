module.exports = {
  options: {
    repository: 'optimizely/marketing-website',
    release: {
      tag_name: 'v1.0.0',
      name: 'v1.0.0',
      body: 'Website packaged at <%= dateVar %>'
    }
  },
  files: {
    src: ['temp/website-stable.zip']
  }
};
