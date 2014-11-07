var path = require('path');
var Nightmare = require('nightmare');
var screenshotPath = path.join(process.cwd(), 'screenshots', '/');
var phantomPath = require('phantomjs').path;
var config = require('../config');
var testPath = config.basePath;

describe('testing the signin, create account, retrieve password dialogs', function() {

  describe('filling out the signin form', function() {

    it('redirects to the dashboard', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(testPath)
        .click('[data-modal-click="signin"]')
        .wait('#signin-dialog')
        .screenshot(screenshotPath)
        .type('#signin-dialog input[name="email"]', config.email)
        .type('#signin-dialog input[name="password"]', config.password)
        .screenshot(screenshotPath)
        .click('#signin-dialog button[type="submit"]')
        .wait(3000)
        .screenshot(screenshotPath)
        .url(function(url) {
          expect(url).toBe('http://0.0.0.0:9000/dashboard');
        })
        .run(done);
    });
  }); //end signin test

  describe('filling out the create account form', function() {
    it('shows the logged in utility nav', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .goto(testPath)
        .click('[data-modal-click="signup"]')
        .wait('#signup-dialog')
        .type('#signup-dialog input[name="email"]', config.email)
        .type('#signup-dialog input[name="password1"]', config.password)
        .type('#signup-dialog input[name="password2"]', config.password)
        .click('#signup-dialog button[type="submit"]')
        .wait(3000)
        .evaluate(function() {
          return {
            signedIn: document.body.classList.contains('signed-in'),
            navEmail: document.querySelector('#my-account-menu .customer-email').innerHTML
          };
        }, function(results) {
            expect(results.signedIn).toBe(true);
            expect(results.navEmail.match('@').length).not.toBe(0);
        })
        .run(done);
    });
  }); //end create account test
  
  describe('filling out the retrieve password form', function() {
    it('displays the email sent success message', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .goto(testPath)
        .click('[data-modal-click="signin"]')
        .click('[data-modal-click="reset-password"]')
        .wait('#reset-password-dialog')
        .type('#reset-password-dialog input[name="email"]', config.retrievePasswordEmail)
        .click('#reset-password-dialog button[type="submit"]')
        .wait(3000)
        .evaluate(function() {
          return document.querySelector('#reset-password-dialog .options p').innerHTML;
        }, function(optionsElmText) {
            expect(optionsElmText).toBe('Email sent.');
        })
        .run(done);
    });
  }); //end retrieve password test

});
