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

signinForm.on('load', function(e){
  signinDialogHelperInst.load(e);
  signinDialogHelperInst.processingRemove({callee: 'load'});
}.bind(signinDialogHelperInst));

signinForm.on('done', function(){
  signinDialogHelperInst.processingRemove({callee: 'done'});
}.bind(signinDialogHelperInst));
