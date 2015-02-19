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

    if(response){
      //remove error class from body?
      w.optly.mrkt.Oform.trackLead({
        email: d.getElementById('seo-form').querySelector('#email').value,
        url: d.getElementById('seo-form').querySelector('#url').value,
        name: d.getElementById('seo-form').querySelector('#name').value,
        phone: d.getElementById('seo-form').querySelector('#phone').value
      }, event);
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
        label: 'status not 200: ' + event.target.status
      }, {
        integrations: {
          'Marketo': false
        }
      });

      if(response.error && typeof response.error === 'string'){
        //update error message, apply error class to body
        $('#seo-form .error-message').text(response.error);
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
