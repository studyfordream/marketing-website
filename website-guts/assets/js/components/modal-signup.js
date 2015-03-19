var signupDialogHelperInst = window.optly.mrkt.form.createAccount({formId: 'signup-form', dialogId: 'signup-dialog'});

w.optly.mrkt.activeModals = {};

w.optly.mrkt.activeModals['signup-form'] = new Oform({
  selector: '#signup-form',
  customValidation: {
    password1: function(elm) {
      return signupDialogHelperInst.password1Validate(elm);
    },
    password2: function(elm) {
      return signupDialogHelperInst.password2Validate(elm);
    }
  },
  middleware: w.optly.mrkt.Oform.defaultMiddleware
});

w.optly.mrkt.activeModals['signup-form'].on('before', function() {
  //set the hidden input value
  signupDialogHelperInst.formElm.querySelector('[name="hidden"]').value = 'touched';
  signupDialogHelperInst.processingAdd();
  if(signupDialogHelperInst.characterMessageElm.classList.contains('oform-error-show')) {
    signupDialogHelperInst.characterMessageElm.classList.remove('oform-error-show');
  }
  return true;
});

w.optly.mrkt.activeModals['signup-form'].on('validationerror', function(elm) {
  w.optly.mrkt.Oform.validationError(elm);
  signupDialogHelperInst.showOptionsError({error: 'DEFAULT'});
  if(!signupDialogHelperInst.characterMessageElm.classList.contains('oform-error-show')) {
    signupDialogHelperInst.characterMessageElm.classList.add('oform-error-show');
  }
});

w.optly.mrkt.activeModals['signup-form'].on('error', function() {
  signupDialogHelperInst.processingRemove({callee: 'error'});
  signupDialogHelperInst.showOptionsError({error: 'UNEXPECTED'});
  window.analytics.track('create account xhr error', {
    category: 'account',
    label: w.location.pathname
  }, {
    integrations: {
      Marketo: false
    }
  });
}.bind(signupDialogHelperInst));

w.optly.mrkt.activeModals['signup-form'].on('load', signupDialogHelperInst.load.bind(signupDialogHelperInst));

w.optly.mrkt.activeModals['signup-form'].on('done', function() {
  if (document.body.classList.contains('oform-error')) {
    signupDialogHelperInst.processingRemove({callee: 'done'});
  }
}.bind(signupDialogHelperInst));
