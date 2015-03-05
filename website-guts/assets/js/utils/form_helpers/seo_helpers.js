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

  success: function(event) {
    var response = this.parseResponse(event);
    var pageData = {
      email: this.formElm.email.value,
      url: this.formElm.url.value,
      name: this.formElm.name.value,
      phone: this.formElm.phone.value
    };

    if(response){
      //remove error class from body?
      w.optly.mrkt.Oform.trackLead({
        formElm: this.formElm,
        pageData: pageData,
        XHRevent: event.XHR
      });
      //[> legacy reporting - to be deprecated <]
      w.analytics.track('/free-trial/success', {
        category: 'account',
        label: w.location.pathname
      }, {
        'Marketo': false
      });
      w.Munchkin.munchkinFunction('visitWebPage', {
        url: '/free-trial/success'
      });
      w.analytics.page('/account/create/success', {
        integrations: {
          'Marketo': false
        }
      });
      w.analytics.page('/free-trial/success', {
        integrations: {
          'Marketo': false
        }
      });

      this.redirectHelper({
        redirectPath: w.linkPath + '/welcome',
        bodyData: {
          formSuccess: document.getElementById('seo-form').getAttribute('action')
        }
      });
    } else {
      w.analytics.track(w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname), {
        category: 'api error',
        label: 'status not 200: ' + event.XHR.status
      }, {
        integrations: {
          'Marketo': false
        }
      });

      if(response.error && typeof response.error === 'string'){
        //update error message, apply error class to body
        this.showOptionsError({serverMessage: response.error});
        $('body').addClass('oform-error').removeClass('oform-processing');
        w.analytics.track(w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname), {
          category: 'api error',
          label: 'response.error: ' + response.error
        }, {
          integrations: {
            'Marketo': false
          }
        });
      } else {
        this.showOptionsError({error: 'UNEXPECTED'});
        $('body').addClass('oform-error').removeClass('oform-processing');
      }
    }
  },

  error: function() {
    this.showOptionsError({error: 'UNEXPECTED'});
    $('body').addClass('oform-error').removeClass('oform-processing');
  },

  done: function() {
    if($('body').hasClass('oform-error')){
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
