var Nightmare = require('nightmare');
//var path = require('path');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var freeTrialPath = config.basePath + '/staging/pricing/?phantom=true';

describe('test starter plan signup on pricing page', function() {

  describe('filling out the create account form', function() {
    it('shows the logged in utility nav', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(freeTrialPath)
        .click('#starter-plan .action')
        .wait(300)
        .type('#signup-dialog-new input[name="email"]', config.email)
        .type('#signup-dialog-new input[name="password1"]', 'ks93+-93KLI')
        .type('#signup-dialog-new input[name="password2"]', 'ks93+-93KLI')
        .screenshot(config.screenshot({ imgName: 'signup-form-filled' }))
        .click('#signup-dialog-new button[type="submit"]')
        //.wait(3000)
        //.wait(config.formSuccessElm({formAction: '/account/create'}))
        .wait('[data-change-plan-success="/pricing/change_plan"]')
        .screenshot(config.screenshot({ imgName: 'signup-complete' }))
        .evaluate(function() {
          return document.body.getAttribute('class');
        }, function(result) {
            var createAccount = /create\-account\-success/;
            var changePlan = /change\-plan\-success/;
            expect(createAccount.test(result)).toBe(true);
            expect(changePlan.test(result)).toBe(true);
        })
        .run(done);
    });
  }); //end create account test

});
