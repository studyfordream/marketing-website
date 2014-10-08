var signinDialogHelperInst = window.optly.mrkt.form.signin({formId: 'signin-form'});

var signinForm = new Oform({
  selector: '#signin-form',
  customValidation: {
    password: function(elm) {
      return signinDialogHelperInst.passwordValidation(elm);
    }
  }
});

signinForm.on('before', function() {
  signinDialogHelperInst.processingAdd();
  return true;
});

signinForm.on('validationerror', w.optly.mrkt.Oform.validationError);

signinForm.on('error', function() {
  signinDialogHelperInst.processingRemove({callee: 'error'});
  signinDialogHelperInst.showOptionsError('An unexpected error occurred. Please contact us if the problem persists.');
  window.analytics.track('signin xhr error', {
    category: 'account',
    label: w.location.pathname
  });
}.bind(signinDialogHelperInst));

signinForm.on('load', signinDialogHelperInst.load.bind(signinDialogHelperInst));

signinForm.on('done', function(){
  signinDialogHelperInst.processingRemove({callee: 'done'});
}.bind(signinDialogHelperInst));
