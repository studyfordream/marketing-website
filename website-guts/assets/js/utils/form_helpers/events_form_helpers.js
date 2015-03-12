window.optly.mrkt.form = window.optly.mrkt.form || {};

var eventsFormHelper = {

  success: function(returnData) {
    document.body.classList.add('marketing-event-lead-create-success');

    w.optly.mrkt.Oform.trackLead({
      requestPayload: returnData.requestPayload
    });

    w.analytics.track('lead success', {
      category: 'external event',
      label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
    }, {
      integrations: {
        'Marketo': false
      }
    });

    w.optly.mrkt.modal.open({ modalType: 'external-events-thank-you' });

    window.setTimeout(function() {
      document.location.reload();
    }, 8000);
  },

  error: function() {
    this.showOptionsError({error: 'UNEXPECTED'});
    $('body').addClass('oform-error').removeClass('oform-processing');
  },
};

window.optly.mrkt.form.eventsForm = function(argumentsObj) {
  var constructorArgs = {
    formId: argumentsObj.formId,
    prototype: eventsFormHelper
  };

  return window.optly.mrkt.form.HelperFactory(constructorArgs);

};
