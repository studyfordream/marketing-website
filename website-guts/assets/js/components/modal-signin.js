(function(){
  'use strict';
  var dialogElm = document.getElementById('signin-dialog'),
  optionsErrorElm = dialogElm.getElementsByClassName('options')[0].querySelector('p:last-child'),
  formElm = document.getElementById('signin-form'),
  message;

  function showOptionsError(elm, message){
    if(!document.body.classList.contains('error-state')) {
      document.body.classList.add('error-state');
    }
    if( !elm.classList.contains('error-show') ) {
      elm.classList.add('error-show');
      elm.innerHTML = message;
    }
  }

  var signinForm = new Oform({
    selector: '#signin-form',
    customValidation: {
      password: function(elm) {
        if(elm.value.length > 0) {
          return true;
        } else {
          return false;
        }
      }
    }
  });

  signinForm.on('validationerror', function(elm){
    w.optly.mrkt.Oform.validationError(elm);
  });

  signinForm.on('load', function(e){
    var resp = JSON.parse(e.target.responseText);
    var path = w.location.pathname;

    if(e.target.status !== 200) {
      showOptionsError(optionsErrorElm, resp.error);
      return;
    }

    if(path.substr(-1) === '/') {
        path = path.substr(0, path.length - 1);
    }

    if (path !== '/pricing') {
     w.location = '/dashboard';
    }
    else {
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

