window.optly.mrkt.form = window.optly.mrkt.form || {};

var contactSalesHelpers = {
  success: function() {

    d.body.classList.add('contact-sales-success');

    var randomString = window.optly.mrkt.utils.randomString();
    w.analytics.identify(randomString, {
      FirstName: $('#contact-sales-form [name="first_name"]').val(),
      LastName: $('#contact-sales-form [name="last_name"]').val(),
      Company: $('#contact-sales-form [name="company_name"]').val(),
      Title: $('#contact-sales-form [name="title"]').val(),
      Phone: $('#contact-sales-form [name="phone_number"]').val(),
      Website: $('#contact-sales-form [name="website"]').val(),
      Inbound_Lead_Form_Type__c: 'Contact Sales',
      Web__c: $('input[type="checkbox"][name="web"]').is(':checked') + '',
      Mobile_Web__c: $('input[type="checkbox"][name="mobile_web"]').is(':checked') + '',
      iOS__c: $('input[type="checkbox"][name="ios"]').is(':checked') + '',
      Android__c: $('input[type="checkbox"][name="android"]').is(':checked') + ''
    }, {
      integrations: {Marketo: true}
    });

    w.analytics.track('contact sales succcess', {
      category: 'forms',
      label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
    });

    w.Munchkin.munchkinFunction('visitWebPage', {
      url: '/event/contact-sales/success'
    });

    w.setTimeout(function() {

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
