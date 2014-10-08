w.optly.mrkt.index = {};

w.optly.mrkt.index.testItOut = function(editURL){

  //send user to the editor
  w.location = '/edit?url=' + editURL;

  w.analytics.track('homepage test it out submitted', {

    category: 'forms',
    label: w.location.pathname

  });

};

$('#test-it-out-form input[type="text"]').focus();

$('#test-it-out-form').submit(function(e){

  var inputVal = $('#test-it-out-form input[type="text"]').val();

  if( inputVal ){

      w.optly.mrkt.index.testItOut( inputVal );

  } else {

    $('input[type="text"]').focus();

  }

  e.preventDefault();

});

var touchHomeFormHelperInst = window.optly.mrkt.form.createAccount({formId: 'touch-homepage-create-account-form'});

var touchHomeForm = new Oform({
  selector: '#touch-homepage-create-account-form',
  customValidation: {
    password1: function(elm) {
      return touchHomeFormHelperInst.password1Validate(elm);
    },
    password2: function(elm) {
      return touchHomeFormHelperInst.password2Validate(elm);
    }
  }
});

touchHomeForm.on('before', function() {
  //set the hidden input value
  touchHomeFormHelperInst.formElm.querySelector('[name="hidden"]').value = 'touched';
  touchHomeFormHelperInst.processingAdd();
  return true;
});

touchHomeForm.on('validationerror', w.optly.mrkt.Oform.validationError);

touchHomeForm.on('validationerror', function(elm) {
  w.optly.mrkt.Oform.validationError(elm);
  touchHomeFormHelperInst.showOptionsError('Please Correct Form Errors');
});


touchHomeForm.on('load', function(e){
  touchHomeFormHelperInst.load(e);
  touchHomeFormHelperInst.processingRemove({callee: 'load'});
});

touchHomeForm.on('done', function(){
  touchHomeFormHelperInst.processingRemove({callee: 'done'});
  window.setTimeout(function() {
    touchHomeFormHelperInst.scrollTopCta('touch-cta');
  }, 500);
}.bind(touchHomeFormHelperInst));
