new Oform({
  selector: '#signin-form',
  customValidation: {
    password: function(elm) {
      var message;
      var formElm = document.getElementById('signin-form');
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
}).on('validationerror', function(elm){
  var body = document.body;
  var dialogElm = document.getElementById('sign-in-dialog');
  var optionsErrorElm = dialogElm.getElementsByClassName('options')[0].querySelector('p:last-child');

  if( !optionsErrorElm.classList.contains('error-show') ) {
    optionsErrorElm.classList.add('error-show');
  }

  w.optly.mrkt.Oform.validationError(elm);
}).on('load', function(e){
  var data = JSON.parse(e.target.responseText);
  var body = document.body;
  var path = w.location.pathname;

  if (path !== '/edit' && path !== '/pricing') {
    w.location = '/dashboard';
  }
  else {
    if ($('#csrf-token').length === 0) {
      $('body').prepend($('<input id="csrf-token" type="hidden" value="' + data.csrf_token + '">'));
    }

    window.optly.mrkt.modal.close('signin');
  }

}).on('done', w.optly.mrkt.Oform.done);

