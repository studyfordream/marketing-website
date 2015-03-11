window.optly.mrkt.form = window.optly.mrkt.form || {};

var eventsFormHelper = {

  success: function(returnData) {
    document.body.classList.add('marketing-event-lead-create-success');

    if(parsedResp){
      w.optly.mrkt.Oform.trackLead({
        requestPayload: returnData.requestPayload
      });
      //reporting to GA goes here
    }
    window.setTimeout(function() {
      document.location.reload();
    }, 1000);
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
