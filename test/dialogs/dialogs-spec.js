var Nightmare = require('nightmare');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var testPath = config.basePath;

describe('testing the signin, create account, retrieve password dialogs', function() {

  describe('filling out the signin form', function() {

    it('redirects to the dashboard', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(testPath)
        .click('[data-modal-click="signin"]')
        .wait(300)
        .type('#signin-dialog input[name="email"]', config.email)
        .type('#signin-dialog input[name="password"]', config.password)
        .screenshot(config.screenshot({ imgName: 'signin-form-filled' }))
        .click('#signin-dialog button[type="submit"]')
        .wait(500)
        .screenshot(config.screenshot({ imgName: 'signin-form-submit' }))
        .wait(config.formSuccessElm({formAction: '/account/signin'}))
        .evaluate(function() {
          return document.body.dataset.formSuccess;
        }, function(formType) {
          expect(formType).toBe('/account/signin');
        })
        .run(done);
    });
  }); //end signin test

  describe('filling out the create account form', function() {
    it('shows the logged in utility nav', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(testPath)
        .click('[data-modal-click="signup"]')
        .wait(300)
        .type('#signup-dialog input[name="email"]', config.email)
        .type('#signup-dialog input[name="password1"]', config.password)
        .type('#signup-dialog input[name="password2"]', config.password)
        .click('#signup-dialog button[type="submit"]')
        .screenshot(config.screenshot({ imgName: 'signup-form-filled' }))
        .wait('body.signed-in')
        .screenshot(config.screenshot({ imgName: 'signup-complete' }))
        .evaluate(function() {
          return {
            signedIn: document.body.classList.contains('signed-in')
          };
        }, function(results) {
            expect(results.signedIn).toBe(true);
        })
        .run(done);
    });
  }); //end create account test

  describe('filling out the retrieve password form', function() {
    it('displays the email sent success message', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(testPath)
        .click('[data-modal-click="signin"]')
        .click('[data-modal-click="reset-password"]')
        .wait(600)
        .wait('#reset-password-dialog')
        .type('#reset-password-dialog input[name="email"]', config.retrievePasswordEmail)
        .screenshot(config.screenshot({ imgName: 'email-form-filled' }))
        .click('#reset-password-dialog button[type="submit"]')
        .wait(3000)
        .evaluate(function() {
          return document.querySelector('#reset-password-dialog .options p').innerHTML;
        }, function(optionsElmText) {
            expect(optionsElmText).toBe('Email sent.');
        })
        .screenshot(config.screenshot({ imgName: 'email-complete' }))
        .run(done);
    });
  }); //end retrieve password test

});
