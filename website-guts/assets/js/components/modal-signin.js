var signinDialogHelperInst = window.optly.mrkt.form.signin('signin-dialog');

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
