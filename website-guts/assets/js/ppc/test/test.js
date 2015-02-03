$(function(){

  var QUnit = window.QUnit;

  /*

    ============================================================================
    ================================ TEST NOTES ================================
    ============================================================================

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

  QUnit.test('check blur validation catches bad inputs', function(){

    $('#seo-form #url').focus().blur();
    $('#seo-form #name').focus().blur();
    $('#seo-form #email').focus().blur();
    $('#seo-form #phone').focus().blur();

    QUnit.expect(4);

    QUnit.assert.ok($('#seo-form #url').hasClass('oform-error-show'), 'url blur validation worked');

    QUnit.assert.ok($('#seo-form #name').hasClass('oform-error-show'), 'name blur validation worked');

    QUnit.assert.ok($('#seo-form #email').hasClass('oform-error-show'), 'email blur validation worked');

    //phone number is not required so this input should not have an error
    QUnit.assert.ok(!$('#seo-form #phone').hasClass('oform-error-show'), 'phone did not validate');

  });

  QUnit.test('check submit validation catches bad inputs', function(){

    $('#seo-form #url').val('Q');
    $('#seo-form #name').val('');
    $('#seo-form #email').val('Q');
    $('#seo-form #phone').val('');

    QUnit.expect(4);

    QUnit.assert.ok($('#seo-form #url').hasClass('oform-error-show'), 'url blur validation worked');

    QUnit.assert.ok($('#seo-form #name').hasClass('oform-error-show'), 'name blur validation worked');

    QUnit.assert.ok($('#seo-form #email').hasClass('oform-error-show'), 'email blur validation worked');

    //phone number is not required so this input should not have an error
    QUnit.assert.ok(!$('#seo-form #phone').hasClass('oform-error-show'), 'phone did not validate');

  });

  QUnit.test('check that the form has inline lables for browsers that support the placeholder attribute', function(){

    if(Modernizr.placeholder){

      $('#seo-form input:not([type="hidden"])').each(function(){

        QUnit.assert.equal( $(this).attr('placeholder'), $(this).prev().text(), $(this).attr('id') + ' has placeholder' );

      });

    } else {

      QUnit.expect(0);

    }

  });
  /*
  QUnit.test('check a valid submission', function(){

    $('#seo-form #url').val('kylerush.net');
    $('#seo-form #name').val('kyle rush test');
    $('#seo-form #email').val('kyle+test201512154836@optimizely.com');
    $('#seo-form #phone').val('');

    window.optly.mrkt.trialForm.run({

      target: document.getElementById('seo-form'),

      preventDefault: function(){}

    });

  });
  */

});
