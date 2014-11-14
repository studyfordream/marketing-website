var Nightmare = require('nightmare');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var testPath = config.basePath({path: '/staging/mobile/mobile-mvpp'});

describe('testing the signup forms on the top of the mobile mvpp page', function() {

  describe('fill out the top signup form with an incorrect password', function() {

    it('shows an error on the password field', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(testPath)
        .type('#mobile-signup-form-top input[name="email"]', config.email)
        .type('#mobile-signup-form-top input[name="password"]', 'bad-password')
        .screenshot(config.screenshot({ imgName: 'signup-form-filled' }))
        .click('#mobile-signup-form-top button[type="submit"]')
        .wait(500)
        .screenshot(config.screenshot({ imgName: 'signin-form-submit' }))
        .evaluate(function() {
          return document.getElementById('mobile-signup-form-top').querySelector('.password-related').classList.contains('oform-error-show');
        }, function(passwordError) {
          expect(passwordError).toBeTruthy();
        })
        .run(done);
    });
  }); //end signin test

  describe('fill out the top signup form with no info', function() {

    it('shows an error on the both fields', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(testPath)
        .type('#mobile-signup-form-top input[name="email"]', '')
        .type('#mobile-signup-form-top input[name="password"]', '')
        .screenshot(config.screenshot({ imgName: 'signup-form-filled' }))
        .click('#mobile-signup-form-top button[type="submit"]')
        .wait(500)
        .screenshot(config.screenshot({ imgName: 'signin-form-submit' }))
        .evaluate(function() {
          var passwordError = document.getElementById('mobile-signup-form-top').querySelector('.password-related').classList.contains('oform-error-show');
          var emailError = document.getElementById('mobile-signup-form-top').querySelector('.email-related').classList.contains('oform-error-show');
          return passwordError && emailError;
        }, function(formErrorsShown) {
          expect(formErrorsShown).toBeTruthy();
        })
        .run(done);
    });
  });

  describe('submit the form with valid info', function() {

    it('adds the form success data attribute to the body', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(testPath)
        .type('#mobile-signup-form-top input[name="email"]', config.email)
        .type('#mobile-signup-form-top input[name="password"]', config.password)
        .screenshot(config.screenshot({ imgName: 'signup-form-filled' }))
        .click('#mobile-signup-form-top button[type="submit"]')
        .wait(config.formSuccessElm({formAction: '/account/create'}))
        .screenshot(config.screenshot({ imgName: 'signin-form-submit' }))
        .evaluate(function() {
          return document.body.dataset.formSuccess;
        }, function(formType) {
          expect(formType).toBe('/account/create');
        })
        .run(done);
    });
  });
});
