(function(){
  'use strict';
  var dialogElm = document.getElementById('signin-dialog'),
  optionsErrorElm = dialogElm.getElementsByClassName('options')[0].querySelector('p:last-child'),
  formElm = document.getElementById('signin-form'),
  message;

  function showOptionsErorr(elm, message){
    if( !elm.classList.contains('error-show') ) {
      elm.classList.add('error-show');
      elm.innerHTML = message;
    }
  }

  var signinForm = new Oform({
    selector: '#signin-form',
    customValidation: {
      password: function(elm) {
        var validationPassed = w.optly.mrkt.utils.checkComplexPassword(elm.value);

        if(!validationPassed) {
          if(elm.value.length === 0) {
            message = 'Password is Required';
          } else {
            message = 'Password is Invalid';
          }
        }

        if(message) {
          formElm.getElementsByClassName('password-related')[0].innerHTML = message;
        }
        return validationPassed;
      }
    }
  });

  signinForm.on('validationerror', function(elm){
    showOptionsErorr(optionsErrorElm, 'Invalid Email or Password');

    w.optly.mrkt.Oform.validationError(elm);
  });

  signinForm.on('error', function(e) {
    //Show error message based upon the response object
    //{"id":"5adec841-e681-41c8-adf6-80497d71a542","succeeded":false,"error":"Incorrect email or password."}
    var resp = JSON.parse(e.target.responseText);

    showOptionsErorr(optionsErrorElm, resp.error);
  });

  signinForm.on('load', function(e){
    var resp;
    var path = w.location.pathname;

    if (path !== '/edit' && path !== '/pricing') {
      w.location = '/dashboard';
    }
    else {
      if ($('#csrf-token').length === 0) {
        resp = JSON.parse(e.target.responseText);
        $('body').prepend($('<input id="csrf-token" type="hidden" value="' + resp.csrf_token + '">'));
      }

      window.optly.mrkt.modal.close('signin');
    }

  });

  signinForm.on('done', w.optly.mrkt.Oform.done);


}());

