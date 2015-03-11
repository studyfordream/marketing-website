var Nightmare = require('nightmare');
//var path = require('path');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var sxswPath = config.basePath({path: '/sxsw/'});

describe('event marketing page', function() {

  describe('', function() {
    it('subscribes to starter plan', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(sxswPath)
        .type('#events-form input[name="first_name"]', config.firstName)
        .type('#events-form input[name="last_name"]', config.lastName)
        .type('#events-form input[name="company_name"]', config.company)
        .type('#events-form input[name="email"]', config.email)
        .click('#events-form #ops4')
        .screenshot(config.screenshot({ imgName: 'marketing-events-form-filled' }))
        .click('#signup-dialog button[type="submit"]')
        .wait('body.create-account-success')
        .wait(300)

        .screenshot(config.screenshot({ imgName: 'marketing-event-lead-create-success'}))
        .evaluate(function() {
          return document.body.getAttribute('class');
        }, function(result) {
            var marketingEventLeadSuccess = /marketing\-event\-lead\-create\-success/;
            expect(marketingEventLeadSuccess.test(result)).toBe(true);
        })
        .run(done);
    });
  }); //end create account test

});

