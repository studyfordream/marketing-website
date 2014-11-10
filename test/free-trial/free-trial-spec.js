var path = require('path');
var Nightmare = require('nightmare');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var freeTrialPath = config.basePath + '/free-trial';

describe('testing form on the free trial page', function() {

  describe('submit the form with an invalid email', function() {
    it('the email input will show an error', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(freeTrialPath)
        .type('#seo-form input[name="url-input"]', 'http://google.com')
        .type('#seo-form input[name="name"]', 'DFP')
        .type('#seo-form input[name="email"]', 'this-email-wont-work')
        .screenshot(config.screenshot({ imgName: 'free-trial-email-error-form-filled' }))
        .click('#seo-form button[type="submit"]')
        .wait(1000)
        .screenshot(config.screenshot({ imgName: 'free-trial-email-error' }))
        .exists('#email.oform-error-show', function(emailErrorExists) {
          expect(emailErrorExists).toBe(true);
        }).run(done);
    });
  });

  describe('submit the form without a phone number', function() {
    it('should be successful and redirect to the /edit path', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 100)
        .goto(freeTrialPath)
        // TODO: causing phantom security warning
        //.inject('js', path.join(process.cwd(), '/', 'test/', 'phantomGlobal.js'))
        .type('#seo-form input[name="url-input"]', 'http://google.com')
        .type('#seo-form input[name="name"]', 'DFP')
        .type('#seo-form input[name="email"]', config.email)
        .screenshot(config.screenshot({ imgName: 'free-trial-success-form-filled' }))
        .click('#seo-form button[type="submit"]')
        .wait(300)
        .screenshot(config.screenshot({ imgName: 'free-trial-success-processing' }))
        .wait('body.free-trial-submit-success')
        .evaluate(function() {
          return document.body.classList.contains('free-trial-submit-success');
        }, function(bodySubmitSuccess) {
          expect(bodySubmitSuccess).toBeTruthy();
        })
        .run(done)
    });
  });

  describe('submit the form with no info', function() {
    it('shows an error class on the body', function(done) {
      new Nightmare({phantomPath: phantomPath})
      .viewport(1024, 1000)
      .goto(freeTrialPath)
      .click('#seo-form #submit')
      .wait(1000)
      .screenshot(config.screenshot({ imgName: 'free-trial-error-no-form-info' }))
      .evaluate(function() {
        return document.body.classList.contains('oform-error');
      }, function(bodyClassError) {
        expect(bodyClassError).toBe(true);
      }).run(done);
    });
  });

});

