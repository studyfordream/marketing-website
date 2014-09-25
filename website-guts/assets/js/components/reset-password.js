var resetPassDialogHelperInst = window.optly.mrkt.form.resetPassword({formId: 'reset-password-form'});

var resetPassForm = new Oform({
  selector: '#reset-password-form'
});

resetPassForm.on('validationerror', w.optly.mrkt.Oform.validationError);

resetPassForm.on('load', resetPassDialogHelperInst.load.bind(resetPassDialogHelperInst));

resetPassForm.on('done', w.optly.mrkt.Oform.done);