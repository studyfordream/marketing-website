var Nightmare = require('nightmare');
//var path = require('path');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var homepagePath = config.basePath({path: '/staging/homepage/mobile_mvp/'});

describe('test homepage', function() {

  describe('user submits test-it-out form', function() {
    it('creates an account', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(homepagePath)
        .type('#email-input', config.email)
        .click('#get-started input[type="button"]')
        .wait('body.test-it-out-success')
        .screenshot(config.screenshot({ imgName: 'homepage-test-it-out-submit' }))
        .type('#signup-dialog input[name="email"]', config.email)
        .type('#signup-dialog input[name="password1"]', config.password)
        .type('#signup-dialog input[name="password2"]', config.password)
        .screenshot(config.screenshot({ imgName: 'homepage-anonymous-wall-filled-in' }))
        .click('#signup-dialog button[type="submit"]')
        .wait('body.create-account-success')
        .screenshot(config.screenshot({ imgName: 'homepage-anonymous-wall-complete' }))
        .evaluate(function() {
          return document.body.getAttribute('class');
        }, function(result) {
            var createAccount = /create\-account\-success/;
            var testItOut = /test\-it\-out\-success/;
            expect(createAccount.test(result)).toBe(true);
            expect(testItOut.test(result)).toBe(true);
        })
        .run(done);
    });
  }); //end create account test
});
