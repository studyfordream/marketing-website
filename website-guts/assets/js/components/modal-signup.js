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

    w.optly.mrkt.Oform.trackLead({
      name: formElm.querySelector('[name="name"]').value,
      email: formElm.querySelector('[name="email"]').value,
      phone: formElm.querySelector('[name="phone_number"]').value
    }, e);
    
    window.optly.mrkt.modal.close({ modalType: 'signup', track: false });
    window.optly_q.acctData = resp;
    window.optly_q.push([window.optly.mrkt.showUtilityNav, 'acctData']);

  });

  signupForm.on('done', w.optly.mrkt.Oform.done);

}());


