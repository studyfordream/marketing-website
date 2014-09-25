var signinDialogHelperInst = window.optly.mrkt.form.signin({formId: 'signin-form'});

var signinForm = new Oform({
  selector: '#signin-form',
  customValidation: {
    password: function(elm) {
      return signinDialogHelperInst.passwordValidation(elm);
    }
  }
});

signinForm.on('validationerror', w.optly.mrkt.Oform.validationError);

signinForm.on('load', signinDialogHelperInst.load.bind(signinDialogHelperInst));

signinForm.on('done', w.optly.mrkt.Oform.done);
