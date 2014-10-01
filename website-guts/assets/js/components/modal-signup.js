var signupDialogHelperInst = window.optly.mrkt.form.createAccount({formId: 'signup-form', dialogId: 'signup-dialog'});

var signupForm = new Oform({
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

signupForm.on('before', function() {
  //set the hidden input value
  signupDialogHelperInst.formElm.querySelector('[name="hidden"]').value = 'touched';
  signupDialogHelperInst.processingAdd();
  return true;
});

signupForm.on('validationerror', function(elm) {
  w.optly.mrkt.Oform.validationError(elm);
  signupDialogHelperInst.showOptionsError('Please Correct Form Errors');
});

signupForm.on('load', function(e){
  signupDialogHelperInst.load(e);
  signupDialogHelperInst.processingRemove({callee: 'load'});
});

signupForm.on('done', function() {
  window.setTimeout(function() {
    signupDialogHelperInst.scrollTopDialog();
  }, 500);

  signupDialogHelperInst.processingRemove({callee: 'done'});
}.bind(signupDialogHelperInst));


