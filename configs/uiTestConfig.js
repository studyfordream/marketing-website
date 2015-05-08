var phantomPath = require('phantomjs').path;
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

  return {
    basePath: function(opts) {
      var queryString = createQueryString(opts.queryParams);
      var testPath = 'http://localhost:9000' + '/dist' + opts.path + '?uiTest=true';
      console.log('Testing: ', testPath + queryString);
      return  testPath + queryString;
    },
    firstName: 'David',
    lastName: 'Fox test',
    company: 'Optimizely',
    title: 'Frontend engineer',
    phone: '5555555555',
    website: 'https://www.optimizely.com',
    email: 'testing@optimizely.com',
    retrievePasswordEmail: 'david.fox-powell@optimizely.com',
    password: '1800EatBurritos',
    phantomPath: phantomPath.substring(0, phantomPath.lastIndexOf('/') + 1),
    screenshot: function(opts) {
      return options.dirname + '/screenshots/' + opts.imgName + '.jpg';
    },
    formSuccessElm: function(opts) {
      return 'body[data-form-success="' + opts.formAction + '"]';
    }
  };
};
