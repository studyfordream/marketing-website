window.optly.mrkt.form = window.optly.mrkt.form || {};

var ppcHelper = {

  load: function(returnData){

    var parsedResp = this.parseResponse(returnData),
        form = this.formElm.getAttribute('id');

    if(parsedResp){
      if(returnData.XHR.status === 200){

        w.optly.mrkt.Oform.trackLead({
          form: form,
          response: parsedResp,
          requestPayload: returnData.requestPayload
        });

        w.analytics.track('seo-form success after error ' + w.optly.mrkt.formHadError, {
          category: 'form'
        }, {
          integrations: {
            Marketo: false
          }
        });

        /* legacy reporting - to be deprecated */
        w.analytics.track('/free-trial/success', {
          category: 'account',
          label: w.location.pathname
        });

        w.analytics.page('/free-trial/success', {
          integrations: {
            'Marketo': false
          }
        });

        //for phantom tests
        document.body.dataset.formSuccess = document.getElementById('seo-form').getAttribute('action');

        if(!w.optly.mrkt.automatedTest()){
          setTimeout(function(){
            var redirectURL, domain;
            domain = w.location.hostname;
            if(/^www\.optimizely\./.test(domain)){
              //production
              redirectURL = w.apiDomain + '/edit?url=';
            } else {
              //local dev
              redirectURL = 'https://app.optimizely.com/edit?url=';
            }
            w.location = redirectURL + encodeURIComponent(d.getElementById('url').value);
          }, 1000);
        }

      } else {
        w.analytics.track(w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname), {
          category: 'api error',
          label: 'status not 200: ' + event.XHR.status
        }, {
          integrations: {
            'Marketo': false
          }
        });
        if(parsedResp.error && typeof parsedResp.error === 'string'){
          //update error message, apply error class to body
          $('#seo-form .error-message').text(parsedResp.error);
          $('body').addClass('oform-error').removeClass('oform-processing');
          w.analytics.track(w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname), {
            category: 'api error',
            label: 'response.error: ' + parsedResp.error
          }, {
            integrations: {
              'Marketo': false
            }
          });
        } else {
          $('#seo-form .error-message').text('An unknown error occured.');
          $('body').addClass('oform-error').removeClass('oform-processing');
        }
      }
    } else {
      $('#seo-form .error-message').text('An unknown error occured.');
      $('body').addClass('oform-error').removeClass('oform-processing');
    }

  }

};
