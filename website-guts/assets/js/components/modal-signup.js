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
  return true;
});

signupForm.on('validationerror', w.optly.mrkt.Oform.validationError);

signupForm.on('load', signupDialogHelperInst.load.bind(signupDialogHelperInst));

signupForm.on('done', w.optly.mrkt.Oform.done);


