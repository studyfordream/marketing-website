module.exports = {
  options: {
    repository: 'optimizely/marketing-website',
    release: {
      tag_name: 'tag',
      name: 'name',
      body: 'Description of the release'
    }
  },
  files: {
    src: ['website-stable.zip']
  }
};
