/*function animBtnColor(button) {*/
  //var btnClass = button.classList;
  //if(btnClass.contains('link-hover-color')) {
    //btnClass.remove('link-hover-color');
  //} else {
    //btnClass.add('link-hover-color');
  //}
//}

//function slide($button) {
  //$.each($button, function(i, button) {
    //$(button).on(window.optly.mrkt.anim.transitionend, function() {
      //animBtnColor(button.firstElementChild);
    //});
  //});
/*}*/


$(function(){
  if(!window.optly.mrkt.isMobile()) {
    window.skrollr.init();
  }
  
  var orgFormHelperInst = window.optly.mrkt.form.orgForm({formId: 'org-form'});
  
  var orgForm = new Oform({
    selector: '#org-form'
  });

  orgForm.on('validationerror', w.optly.mrkt.Oform.validationError);

  orgForm.on('error', function() {
    orgFormHelperInst.processingRemove({callee: 'error'});
    window.analytics.track('signin xhr error', {
      category: 'account',
      label: w.location.pathname
    });
  }.bind());

  orgForm.on('load', orgFormHelperInst.bind(orgFormHelperInst));

  orgForm.on('done', function(){
    orgFormHelperInst.processingRemove({callee: 'done'});
  }.bind(orgFormHelperInst));

});
