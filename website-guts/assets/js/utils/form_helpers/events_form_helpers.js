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

    if(typeof returnData.requestPayload.ops === 'string'){
      var eventID = returnData.requestPayload.Lead_Source_Subcategory__c,
          opsScore = parseInt(returnData.requestPayload.ops) * 1000;
      w.ga('send', {
        'hitType': 'timing',
        'timingCategory': 'External event OPS',
        'timingVar': eventID,
        'timingValue': opsScore,
        'page': w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
      });
    }

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
