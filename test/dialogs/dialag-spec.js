var path = require('path');
var Nightmare = require('nightmare');
var screenshotPath = path.join(process.cwd(), 'screenshots', '/');
var phantomPath = require('phantomjs').path;

  var consoleReporter = new jasmine.ConsoleReporter({
    showColors: true,
    print: function() {
      console.log.apply(console, arguments)
    }
  });

  jasmine.getEnv().addReporter(consoleReporter);
  jasmine.getEnv().defaultTimeoutInterval = 30000;


  describe('filling out the signin form', function() {

    it('redirects to the dashboard', function(done) {
      debugger;
      new Nightmare({phantomPath: phantomPath})
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
          debugger;
          expect(url).toBe('http://0.0.0.0:9000/dashboard');
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

  describe('very async!!!', function() {

    jasmine.getEnv().defaultTimeoutInterval = 30000;

    var one = 1;
    it('is ver asyncy but succeeds', function(done) {

      setTimeout(function() {
        expect(one).toBe(1);
        done();
      }, 10000);
    });
  });
  
  describe('filling out the create account form', function() {
    it('shows the logged in utility nav', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .goto('http://0.0.0.0:9000/dist')
        .click('[data-modal-click="signup"]')
        .wait('#signup-dialog')
        .type('#signup-dialog input[name="email"]', 'dfp@optimizely.com')
        .type('#signup-dialog input[name="password1"]', 'EatBurritos2013')
        .type('#signup-dialog input[name="password2"]', 'EatBurritos2013')
        .click('#signup-dialog button[type="submit"]')
        .wait(3000)
        .exists('#signed-in-utility',function(navExists) {
          expect(navExists).toBe(true);
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
      new Nightmare({phantomPath: phantomPath})
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
            expect(optionsElmText).toBe('Email sent.');
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
