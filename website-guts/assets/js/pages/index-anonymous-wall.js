w.optly.mrkt.index = {};

w.optly.mrkt.index.testItOut = function(editURL){

  //send user to the editor
  w.location = window.optly.mrkt.utils.param('/edit', { url: encodeURIComponent(editURL), anonymousWall: false });

  w.analytics.track('homepage test it out submitted', {

    category: 'forms',
    label: w.location.pathname

  });

};

$('#test-it-out-form input[type="text"]').focus();

$('#test-it-out-form').submit(function(e){

  var inputVal = $('#test-it-out-form input[type="text"]').val();

  if( inputVal ){
     w.optly.mrkt.modal.open({ modalType: 'anonymous-wall' }); 
     w.analytics.track('/dialog/show/anonymous_wall', {
       category: 'modal'
     }, {
       Marketo: true
     });
     w.analytics.page('/dialog/show/anonymous_wall');
  } else {
      $('input[type="text"]').focus();
    }

  e.preventDefault();

});

$('[data-modal-btn="close"]').on('click', function() {
  var inputVal = $('#test-it-out-form input[type="text"]').val();
  w.optly.mrkt.index.testItOut(inputVal);
});

var signupDialogHelperInst = window.optly.mrkt.form.createAccount({formId: 'anonymous-wall'});

var signupForm = new Oform({
  selector: '#anonymous-wall',
  customValidation: {
    password1: function(elm) {
      return signupDialogHelperInst.password1Validate(elm);
    },
    password2: function(elm) {
      return signupDialogHelperInst.password2Validate(elm);
    }
  }
});

signupForm.on('before', function() {
  //set the hidden input value
  signupDialogHelperInst.formElm.querySelector('[name="hidden"]').value = 'touched';
  signupDialogHelperInst.processingAdd();
  if(signupDialogHelperInst.characterMessageElm.classList.contains('oform-error-show')) {
    signupDialogHelperInst.characterMessageElm.classList.remove('oform-error-show');
  }
  return true;
});

signupForm.on('validationerror', function(elm) {
  w.optly.mrkt.Oform.validationError(elm);
  signupDialogHelperInst.showOptionsError('Please Correct Form Errors');
  if(!signupDialogHelperInst.characterMessageElm.classList.contains('oform-error-show')) {
    signupDialogHelperInst.characterMessageElm.classList.add('oform-error-show');
  }
});

signupForm.on('error', function() {
  signupDialogHelperInst.processingRemove({callee: 'error'});
  signupDialogHelperInst.showOptionsError('An unexpected error occurred. Please contact us if the problem persists.');
  window.analytics.track('create account xhr error', {
    category: 'account',
    label: w.location.pathname
  });
}.bind(signupDialogHelperInst));

signupForm.on('load', signupDialogHelperInst.loadAnonymousWall.bind(signupDialogHelperInst));

signupForm.on('done', function() {
  signupDialogHelperInst.processingRemove({callee: 'done'});
}.bind(signupDialogHelperInst));

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
