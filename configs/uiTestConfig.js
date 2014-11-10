var path = require('path');

module.exports = function(options){
  return {
    basePath: 'http://0.0.0.0:9000' + global.linkPath,
    email: 'david@g.com',
    retrievePasswordEmail: 'david.fox-powell@optimizely.com',
    password: '1800EatBurritos',
    phantomPath: require('phantomjs').path,
    screenshot: function(opts) {
      return options.dirname + '/screenshots/' + opts.imgName + '.jpg'
    }
  }
};
