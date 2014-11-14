var Nightmare = require('nightmare');
//var path = require('path');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var pricingPath = config.basePath + '/staging/pricing/?phantom=true';

describe('pricing page', function() {

  describe('anonymous visitor', function() {
    it('subscribes to starter plan', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(pricingPath)
        .click('#starter-plan .action')
        .wait(300)
        .type('#signup-dialog-new input[name="email"]', config.email)
        .type('#signup-dialog-new input[name="password1"]', 'ks93+-93KLI')
        .type('#signup-dialog-new input[name="password2"]', 'ks93+-93KLI')
        .screenshot(config.screenshot({ imgName: 'signup-form-filled' }))
        .click('#signup-dialog-new button[type="submit"]')
        //.wait(3000)
        //.wait(config.formSuccessElm({formAction: '/account/create'}))
        .wait('body.create-account-success')
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

  describe('anonymous visitor', function() {
    it('submits contact sales form', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(pricingPath)
        .click('#enterprise-plan .action')
        .wait(300)
        .type('#contact-sales-form input[name="first_name"]', config.firstName)
        .type('#contact-sales-form input[name="last_name"]', config.lastName)
        .type('#contact-sales-form input[name="company_name"]', config.company)
        .type('#contact-sales-form input[name="title"]', config.title)
        .type('#contact-sales-form input[name="email_address"]', config.email)
        .type('#contact-sales-form input[name="phone_number"]', config.phone)
        .type('#contact-sales-form input[name="website"]', config.website)
        .screenshot(config.screenshot({ imgName: 'contact-form-filled' }))
        .click('#contact-sales-form button[type="submit"]')
        .wait('body.contact-sales-success')
        .wait(300)
        .screenshot(config.screenshot({ imgName: 'contact-sales-complete' }))
        .evaluate(function() {
          return document.body.getAttribute('class');
        }, function(result) {
            var contactSalesSubmit = /contact\-sales\-submit/;
            var contactSalesSuccess = /contact\-sales\-success/;
            expect(contactSalesSubmit.test(result)).toBe(true);
            expect(contactSalesSuccess.test(result)).toBe(true);
        })
        .run(done);
    });
  }); //end create account test

});
