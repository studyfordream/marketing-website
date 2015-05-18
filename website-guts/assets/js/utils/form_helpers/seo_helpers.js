window.optly.mrkt.form = window.optly.mrkt.form || {};

var seoHelper = {

  before: function() {
    w.analytics.track('/free-trial/submit', {
      category: 'account',
      label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
    }, {
      integrations: {
        'Marketo': false
      }
    });
    return w.optly.mrkt.Oform.before();
  },

  success: function(returnData) {
    var parsedResp = this.parseResponse(returnData);

    if(parsedResp){
      w.optly.mrkt.Oform.trackLead({
        response: parsedResp,
        requestPayload: returnData.requestPayload
      });

      this.redirectHelper({
        redirectPath: w.apiDomain + '/welcome',
        bodyData: {
          formSuccess: document.getElementById('seo-form').getAttribute('action')
        }
      });
    }
  },

  error: function() {
    this.showOptionsError({error: 'UNEXPECTED'});
    $('body').addClass('oform-error').removeClass('oform-processing');
  },

  done: function() {
    if($('body').hasClass('oform-error')) {
      $('body').removeClass('oform-processing');
      //report that there were errors in the form
      w.analytics.track('seo-form validation error', {
        category: 'form error',
        label: $('input.oform-error-show').length + ' errors',
      }, {
        integrations: {
          'Marketo': false
        }
      });
    }
  }
};

window.optly.mrkt.form.seoForm = function(argumentsObj) {
  var constructorArgs = {
    formId: argumentsObj.formId,
    prototype: seoHelper
  };

  return window.optly.mrkt.form.HelperFactory(constructorArgs);

};
