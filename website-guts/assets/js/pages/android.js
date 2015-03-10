$(function() {
  //deal with input icon animation
  window.optly.mrkt.anim.placeholderIcons({inputs: $('.android__content input[type="email"]')});

  //create the helper instance
  var androidFormHelperInst = window.optly.mrkt.form.android({formId: 'android-form'});

  new Oform({
    selector: '#android-form',
    middleware: w.optly.mrkt.Oform.defaultMiddleware
  })
  .on('before', function() {
    androidFormHelperInst.processingAdd();
    androidFormHelperInst.removeErrors();
  })
  .on('validationerror', function(elm) {
    w.optly.mrkt.Oform.validationError(elm);
  })
  .on('success', function() {
    androidFormHelperInst.success($('.android__content').children());
  })
  .on('done', function() {
    if(document.body.classList.contains('oform-error')) {
      androidFormHelperInst.processingRemove({callee: 'done'});
      androidFormHelperInst.showOptionsError();
    }
  });

});
