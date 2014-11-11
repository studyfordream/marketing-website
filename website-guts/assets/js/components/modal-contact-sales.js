//make this global in case someone needs to remove the Oform instance
w.optly.mrkt.activeModals = {};

w.optly.mrkt.activeModals.contactSales = new Oform({

  selector: 'form#contact-sales-form'

});

var contactSalesForm = w.optly.mrkt.activeModals.contactSales;

contactSalesForm.on('before', function(){

  w.optly.mrkt.Oform.before();

  console.log('before running');

  return true;

}).on('validationError', function(element){

  w.optly.mrkt.Oform.validationError(element);

}).on('load', function(event){



});
