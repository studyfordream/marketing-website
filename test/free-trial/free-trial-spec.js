var path = require('path');
var Nightmare = require('nightmare');
var screenshotPath = path.join(process.cwd(), 'screenshots', '/');
var config = require('../config');
var freeTrialPath = config.basePath + '/free-trial';
var phantomPath = require('phantomjs').path;

describe('testing form on the free trial page', function() {

  describe('submit the form with an invalid email', function() {
    it('the email input will show an error', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000).goto(freeTrialPath)
        .type('#seo-form input[name="url-input"]', 'http://google.com')
        .type('#seo-form input[name="name"]', 'DFP')
        .type('#seo-form input[name="email"]', 'badAssEmail')
        .click('#seo-form button[type="submit"]')
        .wait(1000)
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
        .type('#seo-form input[name="url-input"]', 'http://google.com')
        .type('#seo-form input[name="name"]', 'DFP')
        .type('#seo-form input[name="email"]', config.email)
        .click('#seo-form button[type="submit"]')
        .wait(3000)
        .url(function(url) {
          expect(/edit/.test(url)).toBe(true);
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
      .evaluate(function() {
        return document.body.classList.contains('oform-error');
      }, function(bodyClassError) {
        expect(bodyClassError).toBe(true);
      }).run(done);
    });
  });

});

