window.optly.mrkt.form = window.optly.mrkt.form || {};

var contactSalesHelpers = {
  success: function(returnData) {

    d.body.classList.add('contact-sales-success');

    //var anonymousVisitorIdentifier = window.optly.mrkt.utils.randomString();

    w.optly.mrkt.Oform.trackLead({
      requestPayload: returnData.requestPayload
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
