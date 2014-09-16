var $signinModal = $('[data-optly-modal="signin"]');


new Oform({
  selector: '#sign-in-dialog',
  errorHiddenClass: 'error-hide',
  customValidation: {
    password: function(elm) {
      return window.optly.mrkt.utils.checkComplexPassword(elm.value);
    }
  },
  middleware: function(XhrObj, data){
    var checkedElm = document.getElementById(this.selector.replace(/\#/, '')).querySelector('[name="persist"');

    if( !checkedElm.checked ) {
      return data.replace(/\&persist\=on/, '');
    } else {
      return data;
    }
  }
}).on('validationError', function(element){
  $('body').addClass('error-state');

  window.analytics.track(window.location, {
    category: 'signin',
    label: 'form-error',
    value: element.getAttribute('name')
  });
}).on('load', function(event){
  window.location = 'https://www.optimizely.com/dashboard';
});

