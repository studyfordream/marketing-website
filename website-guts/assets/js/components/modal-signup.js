(function() {
  'use strict';

  var formElm = document.getElementById('signup-form'),
  dialogElm = document.getElementById('signup-dialog'),
  optionsErrorElm = dialogElm.getElementsByClassName('options')[0].querySelector('p:last-child'),
  characterMessageElm = formElm.getElementsByClassName('password-req')[0],
  message;

  function customErrorMessage(elm, message) {
    if(message) {
      elm.innerHTML = message;
    }
  }

  function logSignupType() {
    var trackEvent;
    // Log event in Marketo if this signup occurred as part of the signin flow for the Optimizely community
    var queryParameters = w.optly.mrkt.utils.deparam( window.location.search );
    if (!('continue_to' in queryParameters)) {
      return;
    }

    var continue_to_parts = decodeURIComponent(queryParameters.continue_to).split('?');
    if (continue_to_parts.length !== 2) {
      return;
    }

    var POSSIBLE_COMMUNITY_SSO_REFERER_PREFIXES = [
      'referer=http://community.optimizely.com',
      'referer=https://community.optimizely.com'
    ];
    var continue_to_url_param_parts = continue_to_parts[1].split('&');
    for (var i = 0; i < continue_to_url_param_parts.length; i++) {
      for (var j = 0; j < POSSIBLE_COMMUNITY_SSO_REFERER_PREFIXES.length; j++) {
        if (continue_to_url_param_parts[i].indexOf(POSSIBLE_COMMUNITY_SSO_REFERER_PREFIXES[j]) === 0) {
          trackEvent = '/account/create/for_community_signin';
          break;
        }
      }
    }

    return trackEvent;
  }

  var signupForm = new Oform({
    selector: '#signup-form',
    customValidation: {
      password1: function(elm) {
        var validationPassed = w.optly.mrkt.utils.checkComplexPassword(elm.value);
        var errorElm = formElm.getElementsByClassName('password1-related')[0];

        if(!validationPassed) {
          if(elm.value.length === 0) {
            message = 'This field is required';
          } else {
            message = 'Password is Invalid';
          }
          characterMessageElm.classList.add('error-show');
        } else if (validationPassed && characterMessageElm.classList.contains('error-show')) {
          characterMessageElm.className = characterMessageElm.classList.remove('error-show');
        }

        customErrorMessage(errorElm, message);

        return validationPassed;
      },
      password2: function(elm) {
        var password1 = formElm.querySelector('[name="password1"]');
        var errorElm = formElm.getElementsByClassName('password2-related')[0];

        if(elm.value.length === 0) {
          message = 'This field is required';
        } else if (elm.value !== password1.value) {
          message = 'Please enter the same value again';
        }

        customErrorMessage(errorElm, message);

        return elm.value === password1.value && w.optly.mrkt.utils.checkComplexPassword(password1.value);
      }
    },
    middleware: function(xhrObj, data) {
      var urlParams = w.optly.mrkt.utils.deparam( window.location.search );

      if (urlParams.signup_platform) {
        data += '&platform=' + urlParams.signup_platform;
      }

      return data;
    }
  });

  signupForm.on('before', function() {
    //set the hidden input value
    formElm.querySelector('[name="hidden"]').value = 'touched';
    return true;
  });

  signupForm.on('validationerror', function(elm){
    
    w.optly.mrkt.Oform.validationError(elm);
    
  });

  signupForm.on('error', function(e) {
    //Show error message based upon the response object
    //{"id":"440b1896-ebd5-47f8-a5e8-6932d20eb242","succeeded":false,"error":"Account already exists."}
    var resp = JSON.parse(e.target.responseText);
    
    if(!optionsErrorElm.classList.contains('error-show')) {
      optionsErrorElm.classList.add('error-show');
      optionsErrorElm.innerHTML = resp.error;
    }

  });

  signupForm.on('load', function(e){
    var optCommSignup = logSignupType();
    var resp = JSON.parse(e.target.response);
    //get resonse info here and log to segment
    if ($('#csrf-token').length === 0) {
        $('body').prepend($('<input id="csrf-token" type="hidden" value="' + resp.csrf_token + '">'));
    }
    var source = w.optly.mrkt.source;
    w.analytics.identify(resp.email,{
      email: resp.email,
      name: resp.first_name + ' ' + resp.last_name,
      phone: resp.phone,
      token: resp.csrf_token,
      utm_Campaign__c: source.utm.campaign,
      utm_Content__c: source.utm.content,
      utm_Medium__c: source.utm.medium,
      utm_Source__c: source.utm.source,
      utm_Keyword__c: source.utm.keyword,
      otm_Campaign__c: source.otm.campaign,
      otm_Content__c: source.otm.content,
      otm_Medium__c: source.otm.medium,
      otm_Source__c: source.otm.source,
      otm_Keyword__c: source.otm.keyword,
      Signup_Platform__c: source.signupPlatform
    }, {
      integrations: {
        Marketo: true
      }
    });
    w.analytics.track('account created', {
      category: 'account',
      label: w.location.pathname
    }, {
      Marketo: true
    });
    if ( optCommSignup ) {
      w.analytics.track(optCommSignup, {
        category: 'account',
        label: w.location.pathname
      }, {
        Marketo: true
      });
    }

    window.optly.mrkt.modal.close('signup');
    window.optly.mrkt.showUtilityNav(resp);

  });

  signupForm.on('done', w.optly.mrkt.Oform.done);

}());


