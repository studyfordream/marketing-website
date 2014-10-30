var path = require('path');
var Nightmare = require('nightmare');
var nightmare = new Nightmare();
var should = require('chai').should();
var screenshotPath = path.join(process.cwd(), 'screenshots', '/');

describe('testing signin, create account, and retrieve password', function() {
  this.timeout(30000);
  describe('filling out the signin form', function() {
    it('redirects to the dashboard', function(done) {
      nightmare
        .viewport(1024, 1000)
        .goto('http://0.0.0.0:9000/dist')
        .click('[data-modal-click="signin"]')
        .wait('#signin-dialog')
        .screenshot(screenshotPath)
        .type('#signin-dialog input[name="email"]', 'dfp@optimizely.com')
        .type('#signin-dialog input[name="password"]', 'EatBurritos2013')
        .screenshot(screenshotPath)
        .click('#signin-dialog button[type="submit"]')
        .wait(3000)
        .screenshot(screenshotPath)
        .url(function(url) {
          url.should.eq('http://0.0.0.0:9000/dashboard');
          done();
        })
        .run(function(err, nightmare){
          if(err) {
            console.log('error', err);
          } else {
            console.log('Done.');
          }
        });
    });
  }); //end signin test
  
  describe('filling out the create account form', function() {
    it('shows the logged in utility nav', function(done) {
      nightmare
        .goto('http://0.0.0.0:9000/dist')
        .click('[data-modal-click="signup"]')
        .wait('#signup-dialog')
        .type('#signup-dialog input[name="email"]', 'dfp@optimizely.com')
        .type('#signup-dialog input[name="password1"]', 'EatBurritos2013')
        .type('#signup-dialog input[name="password2"]', 'EatBurritos2013')
        .click('#signup-dialog button[type="submit"]')
        .wait(3000)
        .exists('#signed-in-utility',function(navExists) {
          navExists.should.be.true;
          done();
        })
        .run(function(err, nightmare){
          if(err) {
            console.log('error', err);
          } else {
            console.log('Done.');
          }
        });
    });
  }); //end create account test
  
  describe('filling out the retrieve password form', function() {
    it('displays the email sent success message', function(done) {
      nightmare
        .goto('http://0.0.0.0:9000/dist')
        .click('[data-modal-click="signin"]')
        .click('[data-modal-click="reset-password"]')
        .wait('#reset-password-dialog')
        .type('#reset-password-dialog input[name="email"]', 'david.fox-powell@optimizely.com')
        .click('#reset-password-dialog button[type="submit"]')
        .wait(3000)
        .evaluate(function() {
          return document.querySelector('#reset-password-dialog .options p').innerHTML;
        }, function(optionsElmText) {
            optionsElmText.should.eq('Email sent.');
            done();
        })
        .run(function(err, nightmare){
          if(err) {
            console.log('error', err);
          } else {
            console.log('Done.');
          }
        });
    });
  }); //end retrieve password test

});

