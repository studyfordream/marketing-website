var path = require('path');

module.exports = function(options){
  return {
    basePath: function(opts) {
      return 'http://0.0.0.0:9000' + global.linkPath + opts.path + '?phantom=true'
    },
    email: 'david@g.com',
    basePath: function(opts) {
      var queryParams = opts.queryParams ? '&' + opts.queryParams : '';
      return 'http://0.0.0.0:9000' + global.linkPath + opts.path + '?phantom=true' + queryParams
    },
    firstName: 'David',
    lastName: 'Fox test',
    company: 'Optimizely',
    title: 'Frontend engineer',
    phone: '5555555555',
    website: 'https://www.optimizely.com',
    email: 'david@optimizely.com',
    retrievePasswordEmail: 'david.fox-powell@optimizely.com',
    password: '1800EatBurritos',
    phantomPath: require('phantomjs').path,
    screenshot: function(opts) {
      return options.dirname + '/screenshots/' + opts.imgName + '.jpg'
    },
    formSuccessElm: function(opts) {
      return 'body[data-form-success="' + opts.formAction + '"]';
    }
  }
};
