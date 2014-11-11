w.optly.mrkt.activeModals.signup.remove();

var signupDialogHelperInst = window.optly.mrkt.form.createAccount({formId: 'signup-form', dialogId: 'signup-dialog'});

w.optly.mrkt.activeModals = w.optly.mrkt.activeModals || {};

w.optly.mrkt.activeModals.signupPricing = new Oform({
  selector: '#signup-form',
  customValidation: {
    password1: function(elm) {
      return signupDialogHelperInst.password1Validate(elm);
    },
    password2: function(elm) {
      return signupDialogHelperInst.password2Validate(elm);
    }
  }
});

w.optly.mrkt.activeModals.signupPricing.on('before', function() {
  //set the hidden input value
  signupDialogHelperInst.formElm.querySelector('[name="hidden"]').value = 'touched';
  signupDialogHelperInst.processingAdd();
  if(signupDialogHelperInst.characterMessageElm.classList.contains('oform-error-show')) {
    signupDialogHelperInst.characterMessageElm.classList.remove('oform-error-show');
  }
  return true;
});

w.optly.mrkt.activeModals.signupPricing.on('validationerror', function(elm) {
  w.optly.mrkt.Oform.validationError(elm);
  signupDialogHelperInst.showOptionsError('Please Correct Form Errors');
  if(!signupDialogHelperInst.characterMessageElm.classList.contains('oform-error-show')) {
    signupDialogHelperInst.characterMessageElm.classList.add('oform-error-show');
  }
});

w.optly.mrkt.activeModals.signupPricing.on('error', function() {
  signupDialogHelperInst.processingRemove({callee: 'error'});
  signupDialogHelperInst.showOptionsError('An unexpected error occurred. Please contact us if the problem persists.');
  window.analytics.track('create account xhr error', {
    category: 'account',
    label: w.location.pathname
  });
}.bind(signupDialogHelperInst));

w.optly.mrkt.activeModals.signupPricing.on('load', signupDialogHelperInst.load.bind(signupDialogHelperInst));

w.optly.mrkt.activeModals.signupPricing.on('done', function() {
  window.setTimeout(function() {
    signupDialogHelperInst.scrollTopDialog();
  }, 500);

  signupDialogHelperInst.processingRemove({callee: 'done'});
}.bind(signupDialogHelperInst));
