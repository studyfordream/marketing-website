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

  function showOptionsError(elm, message){
    if(!document.body.classList.contains('error-state')) {
      document.body.classList.add('error-state');
    }
    if( !elm.classList.contains('error-show') ) {
      elm.classList.add('error-show');
      elm.innerHTML = message;
    }
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
    }
  });

  signupForm.on('before', function() {
    //set the hidden input value
    formElm.querySelector('[name="hidden"]').value = 'touched';
    return true;
  });

  signupForm.on('validationerror', w.optly.mrkt.Oform.validationError);

  signupForm.on('load', function(e){
    var resp = JSON.parse(e.target.responseText);

    if(e.target.status !== 200) {
      showOptionsError(optionsErrorElm, resp.error);
      return;
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
      GCLID__c: source.gclid,
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

    window.optly.mrkt.modal.close('signup', false);
    window.optly_q.acctData = resp;
    window.optly_q.push([window.optly.mrkt.showUtilityNav, 'acctData']);

  });

  signupForm.on('done', w.optly.mrkt.Oform.done);

}());


