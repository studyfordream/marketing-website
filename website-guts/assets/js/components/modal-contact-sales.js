//make this global in case someone needs to remove the Oform instance
w.optly.mrkt.activeModals = {};

var contactSalesHelperInst = window.optly.mrkt.form.contactSales({formId: 'contact-sales-form'});

w.optly.mrkt.activeModals.contactSales = new Oform({

  selector: 'form#contact-sales-form'

});

var contactSalesForm = w.optly.mrkt.activeModals.contactSales;

contactSalesForm.on('before', function(){

  d.body.classList.add('contact-sales-submit');

  w.optly.mrkt.Oform.before();

  w.analytics.track('contact sales submit', {
    category: 'forms',
    label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
  });

  contactSalesHelperInst.removeErrors();
  contactSalesHelperInst.processingAdd();

  return true;

}).on('validationError', function(element){

  w.optly.mrkt.Oform.validationError(element);

}).on('error', function() {
  var message = 'There was in processing your contact request.';
  contactSalesHelperInst.showErrorDialog(message);
  contactSalesHelperInst.showOptionsError();

}).on('success', function(inputs){

  contactSalesHelperInst.success(inputs);

}.bind(contactSalesHelperInst)).on('done', function() {
  if(document.body.classList.contains('oform-error')) {
    contactSalesHelperInst.processingRemove({callee: 'done'});
    contactSalesHelperInst.showOptionsError();
  }
});
