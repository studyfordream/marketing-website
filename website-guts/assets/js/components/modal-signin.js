new Oform({
  selector: '#sign-in-dialog',
  customValidation: {
    password: function(elm) {
      return w.optly.mrkt.utils.checkComplexPassword(elm.value);
    }
  }
}).on('validationerror', function(elm){
  var body = document.body;
  var formElm = document.getElementById('sign-in-dialog');

  if( !body.classList.contains('error-state') ) {
    body.classList.add('error-state');
  }

  var optionsErrorElm = formElm.getElementsByClassName('options')[0].querySelector('p:last-child');

  if( !optionsErrorElm.classList.contains('error-show') ) {
    optionsErrorElm.classList.add('error-show');
  }

  w.optly.mrkt.Oform.validationError(elm);
  
}).on('load', function(){
  var body = document.body;

  if( body.classList.contains('error-state') ) {
    body.classList.remove('error-state');
  }

  w.location = 'https://www.optimizely.com/dashboard';
}).on('done', w.optly.mrkt.Oform.done);

