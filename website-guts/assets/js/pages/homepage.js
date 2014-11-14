// Listen for the 'get started' button press
$('#get-started').submit(function(e){
  e.preventDefault();

  var inputVal = $('#get-started input[type="email"]').val();

  if( inputVal ){
    w.optly.mrkt.modal.open({ modalType: 'anonymous-wall' });
    $('input[type="email"]').val(inputVal);
  } else {
    $('input[type="text"]').focus();
  }
});

// 'I'll do this later' redirects to pricing page
$('[data-modal-btn="close"]').on('click', function() {
  window.location.href = '/pricing';
});

//deal with placeholder icons
window.optly.mrkt.anim.placeholderIcons({inputs: $('#get-started input')});

// Handle the anonomous wall signup
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

signupForm.on('load', function() {
  window.location.href = '/pricing';
});

signupForm.on('done', function() {
  signupDialogHelperInst.processingRemove({callee: 'done'});
}.bind(signupDialogHelperInst));
