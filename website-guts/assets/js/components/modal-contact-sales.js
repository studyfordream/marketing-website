//make this global in case someone needs to remove the Oform instance
w.optly.mrkt.activeModals = {};

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

  return true;

}).on('validationError', function(element){

  w.optly.mrkt.Oform.validationError(element);

}).on('success', function(inputs){

  d.body.classList.add('contact-sales-success');

  w.analytics.identify(inputs.data.email, {
    FirstName: inputs.data.first_name,
    LastName: inputs.data.last_name,
    Company: inputs.data.company_name,
    Title: inputs.data.title,
    Phone: inputs.data.phone_number,
    Website: inputs.data.website,
    Traffic__c: inputs.data.traffic,
    Inbound_Lead_Form_Type__c: 'Contact Sales'
  });

  w.analytics.track('contact sales succcess', {
    category: 'forms',
    label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
  });

  w.optly.mrkt.modal.close({ modalType: 'contact-sales' });

  w.optly.mrkt.modal.open({ modalType: 'contact-sales-thank-you' });

});
