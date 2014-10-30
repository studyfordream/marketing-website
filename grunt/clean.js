module.exports = {
  preBuild: ['<%= config.dist %>/'],
  postBuild: ['<%= config.temp %>']
};
