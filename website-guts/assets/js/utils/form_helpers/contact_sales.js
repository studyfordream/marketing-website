window.optly.mrkt.form = window.optly.mrkt.form || {};

var contactSalesHelpers = {
  success: function(inputs) {

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

    w.setTimeout(function() {
      w.optly.mrkt.modal.close({ modalType: 'contact-sales' });

      w.optly.mrkt.modal.open({ modalType: 'contact-sales-thank-you' });

    }, 1000);

  }
};

window.optly.mrkt.form.contactSales = function(argumentsObj) {
  var constructorArgs = {
    formId: argumentsObj.formId,
    prototype: contactSalesHelpers
  };

  return window.optly.mrkt.form.HelperFactory(constructorArgs);

};
