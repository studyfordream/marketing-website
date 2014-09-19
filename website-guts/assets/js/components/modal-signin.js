(function(){
  'use strict';
  var dialogElm = document.getElementById('signin-dialog'),
  optionsErrorElm = dialogElm.getElementsByClassName('options')[0].querySelector('p:last-child'),
  formElm = document.getElementById('signin-form'),
  message;

  function showOptionsError(elm, message){
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
    showOptionsError(optionsErrorElm, 'Invalid Email or Password');

    w.optly.mrkt.Oform.validationError(elm);
  });

  signinForm.on('error', function(e) {
    //Show error message based upon the response object
    //{"id":"5adec841-e681-41c8-adf6-80497d71a542","succeeded":false,"error":"Incorrect email or password."}
    var resp = JSON.parse(e.target.responseText);

    showOptionsError(optionsErrorElm, resp.error);
  });

  signinForm.on('load', function(e){
    var resp = JSON.parse(e.target.response);
    var path = w.location.pathname;

    if(path.substr(-1) === '/') {
        path = path.substr(0, path.length - 1);
    }

    if (path !== window.linkPath + '/pricing') {
      w.location = '/dashboard';
    }
    else {
      if ($('#csrf-token').length === 0) {
        resp = JSON.parse(e.target.responseText);
        $('body').prepend($('<input id="csrf-token" type="hidden" value="' + resp.csrf_token + '">'));
      }
      window.optly.mrkt.modal.close('signin');
      
      var expParams = {
        type: 'GET',
        url: '/experiment/load_recent?max_experiments=5',
        properties: {
          experiments: {
            id: 'number',
            description: 'string',
            has_started: 'boolean',
            can_edit: 'boolean'
          }
        }
      };
      //uses xhr service to track any request errors
      var deferred = window.optly.mrkt.services.xhr.makeRequest(expParams);

      deferred.then(function(expData) {
        window.optly_q = new window.optly.mrkt.optly_QFactory(resp, expData);
        window.optly_q.push([window.optly.mrkt.showUtilityNav, 'acctData', 'expData']);
      });
    }

  });

  signinForm.on('done', w.optly.mrkt.Oform.done);


}());

