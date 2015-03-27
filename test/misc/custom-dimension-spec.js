var Nightmare = require('nightmare');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var testPath = config.basePath({path: '/'});

describe('testing the signin, create account, retrieve password dialogs', function() {

  describe('filling out the signin form', function() {

    it('signs the user in', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(testPath)
        .click('[data-modal-click="signin"]')
        .wait(300)
        .type('#signin-dialog input[name="email"]', config.email)
        .type('#signin-dialog input[name="password"]', config.password)
        .screenshot(config.screenshot({ imgName: 'signin-form-filled' }))
        .evaluate(function(){
          window.firstPlanType = document.body.getAttribute('data-plan');
        })
        .click('#signin-dialog button[type="submit"]')
        .wait(500)
        .screenshot(config.screenshot({ imgName: 'signin-form-submit' }))
        .wait('body.signed-in')
        .evaluate(function() {
          return {
            initialPlanType: window.firstPlanType,
            currentPlanType: window.$('body').attr('data-plan')
          };
        }, function(result) {
          expect(result.initialPlanType).toBe('none');
          expect(result.currentPlanType).toBe('free');
        })
        .run(done);
    });

  }); //end signin test

});
