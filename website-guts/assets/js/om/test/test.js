$(function(){

  var QUnit = window.QUnit;

  /*

    ============================================================================
    ================================ TEST NOTES ================================
    ============================================================================

    1. When you run the test make sure the browser and tab has focus on your
       machine or else the first test will fail.

    2. Use these URL query strings to run thest or tests will fail:
        ?uiTest=true&utm_campaign=utm_campaign_uitest&utm_content=utm_content_uitest&utm_medium=utm_medium_uitest&utm_source=utm_source_uitest&utm_keyword=utm_keyword_uitest&otm_campaign=otm_campaign_uitest&otm_content=btt&otm_medium=otm_medium_uitest&otm_source=otm_source_uitest&otm_keyword=otm_keyword_uitest&signup_platform=signup_platform_uitest

  */

  QUnit.test('check that the first field is focused on page load', function(){

    //this test fails if the browser tab is not in focus or if the dev tools console is open

    QUnit.expect(1);

    QUnit.assert.ok($('#seo-form #url').is(':focus'), '#url is focused');

  });

  QUnit.test('check bot prevention works', function(){

    QUnit.expect(1);

    QUnit.assert.equal($('#seo-form #hidden').val(), 'touched', 'input has value hidden');

  });

  QUnit.test('check blur validation does not trigger for blank input', function(){

    $('#seo-form #url').focus().blur();
    $('#seo-form #name').focus().blur();
    $('#seo-form #email').focus().blur();
    $('#seo-form #phone').focus().blur();

    QUnit.expect(4);

    QUnit.assert.ok(!$('#seo-form #url').hasClass('oform-error-show'), 'url blur validation worked');

    QUnit.assert.ok(!$('#seo-form #name').hasClass('oform-error-show'), 'name blur validation worked');

    QUnit.assert.ok(!$('#seo-form #email').hasClass('oform-error-show'), 'email blur validation worked');

    //phone number is not required so this input should not have an error
    QUnit.assert.ok(!$('#seo-form #phone').hasClass('oform-error-show'), 'phone did not validate');

  });

  QUnit.test('check blur validation catches bad inputs', function(){

    $('#seo-form #url').val('t').focus().blur();
    $('#seo-form #email').val('t').focus().blur();
    $('#seo-form #phone').val('1').focus().blur();

    QUnit.expect(3);

    QUnit.assert.ok($('#seo-form #url').hasClass('oform-error-show'), 'url blur validation worked');

    QUnit.assert.ok($('#seo-form #email').hasClass('oform-error-show'), 'email blur validation worked');

    //phone number is not required so this input should not have an error
    QUnit.assert.ok(!$('#seo-form #phone').hasClass('oform-error-show'), 'phone did not validate');

  });

  QUnit.test('check that the form has inline labels for browsers that support the placeholder attribute', function(){

    if(Modernizr.placeholder){

      $('#seo-form input:not([type="hidden"])').each(function(){

        QUnit.assert.equal( $(this).attr('placeholder'), $(this).prev().text(), $(this).attr('id') + ' has placeholder' );

      });

    } else {

      QUnit.expect(0);

    }

  });

  QUnit.test('check the symmetry experiment functionality', function(){

    QUnit.expect(2);

    QUnit.assert.equal($('#ppc-form h4.seo-form-heading').text(), '#1 Behavioral Targeting tool', 'symmetry header works');

    QUnit.assert.equal($('#ppc-form > p').first().text(), 'Welcome to Optimizely. Sign up for a free account and test out the most popular Behavioral Targeting Tool on the planet!');

  });

  QUnit.asyncTest('check submit validation catches bad inputs', function(){

    $('#seo-form #url').val('Q');
    $('#seo-form #name').val('');
    $('#seo-form #email').val('Q');
    $('#seo-form #phone').val('');

    QUnit.expect(4);

    window.optly.mrkt.trialForm.run({

      target: document.getElementById('seo-form'),

      preventDefault: function(){}

    });

    setTimeout(function(){

      QUnit.assert.ok($('#seo-form #url').hasClass('oform-error-show'), 'url blur validation worked');

      QUnit.assert.ok($('#seo-form #name').hasClass('oform-error-show'), 'name blur validation worked');

      QUnit.assert.ok($('#seo-form #email').hasClass('oform-error-show'), 'email blur validation worked');

      //phone number is not required so this input should not have an error
      QUnit.assert.ok(!$('#seo-form #phone').hasClass('oform-error-show'), 'phone did not validate');

      QUnit.start();

    }, 1000);

  });

  QUnit.asyncTest('check a valid submission', function(){

    QUnit.expect(19);

    $('#seo-form #url').val('kylerush.net');
    $('#seo-form #name').val('kyle rush test');
    $('#seo-form #email').val('kyle+test201512154836@optimizely.com');
    $('#seo-form #phone').val('');

    window.optly.mrkt.trialForm.run({

      target: document.getElementById('seo-form'),

      preventDefault: function(){}

    });

    setTimeout(function(){

      QUnit.assert.equal($('body').attr('data-form-success'), '/account/free_trial_create', 'form successfully submitted');

      QUnit.assert.equal($.cookie('sourceCookie'), 'utm_campaign_uitest|||utm_content_uitest|||utm_medium_uitest|||utm_source_uitest|||utm_keyword_uitest|||otm_campaign_uitest|||btt|||otm_medium_uitest|||otm_source_uitest|||otm_keyword_uitest|||undefined|||', 'source cookie is set properly');

      var reportingObject = JSON.parse($('body').attr('data-reporting-object'));

      QUnit.assert.equal(reportingObject.Inbound_Lead_Form_Type__c, 'Free Trial Signup Form', 'Inbound lead form type');

      QUnit.assert.equal(reportingObject.Initial_Form_Source__c, 'Free Trial PPC', 'Initial form source');

      QUnit.assert.equal(reportingObject.leadSource, 'Website', 'lead source');

      QUnit.assert.equal(reportingObject.email, 'david+test2015117154242@optimizely.com', 'email');

      QUnit.assert.equal(reportingObject.firstName, 'david', 'first name');

      QUnit.assert.equal(reportingObject.lastName, 'fox-powell test', 'last name');

      QUnit.assert.equal(reportingObject.otm_Campaign__c, 'otm_campaign_uitest', 'otm campaign');

      QUnit.assert.equal(reportingObject.otm_Content__c, 'btt', 'otm content');

      QUnit.assert.equal(reportingObject.otm_Keyword__c, 'otm_keyword_uitest', 'otm keyword');

      QUnit.assert.equal(reportingObject.otm_Medium__c, 'otm_medium_uitest', 'otm medium');

      QUnit.assert.equal(reportingObject.otm_Source__c, 'otm_source_uitest', 'otm source');

      QUnit.assert.equal(reportingObject.phone, '9172315327', 'phone');

      QUnit.assert.equal(reportingObject.utm_Campaign__c, 'utm_campaign_uitest', 'utm campaign');

      QUnit.assert.equal(reportingObject.utm_Content__c, 'utm_content_uitest', 'utm content');

      QUnit.assert.equal(reportingObject.utm_Keyword__c, 'utm_keyword_uitest', 'utm keyword');

      QUnit.assert.equal(reportingObject.utm_Medium__c, 'utm_medium_uitest', 'utm medium');

      QUnit.assert.equal(reportingObject.utm_Source__c, 'utm_source_uitest', 'utm source');

      QUnit.start();

    }, 3000);

    //check the source cookie

  });

});
