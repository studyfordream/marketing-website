$(function(){

  var QUnit = window.QUnit;

  /*

    Test that blur validation works properly. Blur validation should happen on
    every field except phone number which isn't required.

  */

  QUnit.test('check blur validation', function(){

    $('#seo-form #url').focus().blur();
    $('#seo-form #name').focus().blur();
    $('#seo-form #email').focus().blur();
    $('#seo-form #phone').focus().blur();

    QUnit.expect(4);

    QUnit.assert.ok($('#seo-form #url').hasClass('oform-error-show'), 'url blur validation worked');

    QUnit.assert.ok($('#seo-form #name').hasClass('oform-error-show'), 'name blur validation worked');

    QUnit.assert.ok($('#seo-form #email').hasClass('oform-error-show'), 'email blur validation worked');

    QUnit.assert.ok(!$('#seo-form #phone').hasClass('oform-error-show'), 'phone did not validate');

  });

});
