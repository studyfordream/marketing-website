var Nightmare = require('nightmare');
//var path = require('path');
var config = require('../config')({dirname: __dirname});
var phantomPath = config.phantomPath;
var homepagePath = config.basePath({path: '/'});

describe('test homepage', function() {
  var returnValue;
  describe('user submits test-it-out form', function() {
    it('creates an account', function(done) {
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(homepagePath)
        .wait(300)
        .type('form#get-started #email-input', config.email)
        .click('form#get-started button[type="submit"]')
        .wait('body.test-it-out-success')
        .screenshot(config.screenshot({ imgName: 'homepage-test-it-out-submit' }))
        .type('#signup-dialog input[name="password1"]', config.password)
        .type('#signup-dialog input[name="password2"]', config.password)
        .type('#signup-dialog input[name="phone_number"]', config.phone)
        .click('#signup-dialog input[name="Web_Interest__c"]')
        .click('#signup-dialog input[name="Mobile_Web_Interest__c"]')
        .click('#signup-dialog input[name="iOS_Interest__c"]')
        .click('#signup-dialog input[name="Android_Interest__c"]')
        .screenshot(config.screenshot({ imgName: 'homepage-anonymous-wall-filled-in' }))
        .click('#signup-dialog button[type="submit"]')
        .wait('body.create-account-success')
        .screenshot(config.screenshot({ imgName: 'homepage-anonymous-wall-complete' }))
        .evaluate(function() {
          return document.body.getAttribute('class') + ' ' + document.body.getAttribute('data-reporting-object');
        }, function(result) {
            returnValue = result;
        })
        .run(done);
    });
  }); //end create account test
  describe('verified that', function(){
    it('visitor was signed in', function(){
      expect(/signed\-in/.test(returnValue)).toBe(true);
    });
    it('form submission worked', function(){
      expect(/test\-it\-out\-success/.test(returnValue)).toBe(true);
    });
    it('android checkbox is in reporting object', function(){
      expect(/"Android_Interest__c":"true"/.test(returnValue)).toBe(true);
    });
    it('iOS checkbox is in reporting object', function(){
      expect(/"iOS_Interest__c":"true"/.test(returnValue)).toBe(true);
    });
    it('mobile web checkbox is in reporting object', function(){
      expect(/"Mobile_Web_Interest__c":"true"/.test(returnValue)).toBe(true);
    });
    it('web checkbox is in reporting object', function(){
      expect(/"Web_Interest__c":"true"/.test(returnValue)).toBe(true);
    });
    it('lead source is in reporting object', function(){
      expect(/"leadSource":"Website"/.test(returnValue)).toBe(true);
    });
    it('initial form source is in reporting object', function(){
      expect(/"Initial_Form_Source__c":"Test It Out Homepage"/.test(returnValue)).toBe(true);
    });
    it('inbound lead form type is in reporting object', function(){
      expect(/"Inbound_Lead_Form_Type__c":"Home Page Signup form"/.test(returnValue)).toBe(true);
    });
    it('lead source subcategory is in reporting object', function(){
      expect(/"Lead_Source_Subcategory__c":"Optimizely"/.test(returnValue)).toBe(true);
    });
    it('utm medium is in reporting object', function(){
      expect(/"utm_Medium__c":"direct"/.test(returnValue)).toBe(true);
    });
    it('otm medium is in reporting object', function(){
      expect(/"otm_Medium__c":"direct"/.test(returnValue)).toBe(true);
    });
    it('email is in reporting object', function(){
      expect(/"email":"david_test@optimizely\.com"/.test(returnValue)).toBe(true);
    });
    it('first name is in reporting object', function(){
      expect(/"firstName":"David"/.test(returnValue)).toBe(true);
    });
    it('last name is in reporting object', function(){
      expect(/"lastName":"FP "/.test(returnValue)).toBe(true);
    });
    it('phone is in reporting object', function(){
      expect(/"phone":"999999999"/.test(returnValue)).toBe(true);
    });
  });
});
