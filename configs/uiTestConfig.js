var createQueryString = function(params) {
  var queryString = '';
  if(params) {
    for(var key in params) {
      queryString += ('&' + key + '=' + params[key]);
    }
  }
  return queryString;
};

module.exports = function(options){
  var cachedPath;

  return {
    basePath: function(opts) {
      var queryString = createQueryString(opts.queryParams);
      if(!cachedPath) {
        cachedPath = 'http://0.0.0.0:9000' + global.linkPath + opts.path + '?phantom=true';
      }
      return  cachedPath + queryString;
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
      return options.dirname + '/screenshots/' + opts.imgName + '.jpg';
    },
    formSuccessElm: function(opts) {
      return 'body[data-form-success="' + opts.formAction + '"]';
    }
  };
};
