var signinDialogHelperInst = window.optly.mrkt.form.signin({formId: 'signin-form'});

var signinForm = new Oform({
  selector: '#signin-form',
  customValidation: {
    password: function(elm) {
      return signinDialogHelperInst.passwordValidation(elm);
    }
  },
  middleware: w.optly.mrkt.Oform.defaultMiddleware
});

signinForm.on('before', function() {
  signinDialogHelperInst.processingAdd();
  return true;
});

signinForm.on('validationerror', w.optly.mrkt.Oform.validationError);

signinForm.on('error', function() {
  signinDialogHelperInst.processingRemove({callee: 'error'});
  signinDialogHelperInst.showOptionsError({error: 'UNEXPECTED'});
  window.analytics.track('signin xhr error', {
    category: 'account',
    label: w.location.pathname
  }, {
    integrations: {
      Marketo: false
    }
  });
}.bind(signinDialogHelperInst));

signinForm.on('load', signinDialogHelperInst.load.bind(signinDialogHelperInst));

signinForm.on('done', function(){
  signinDialogHelperInst.processingRemove({callee: 'done'});
  if (document.body.classList.contains('oform-error')) {
    signinDialogHelperInst.showOptionsError();
  }
}.bind(signinDialogHelperInst));
