window.optly.mrkt.form = window.optly.mrkt.form || {};

var mobileMvppHelper = {

  removeErrors: function() {
    if(document.body.classList.contains('error-state')) {
      document.body.classList.remove('error-state');
    }
    if( this.optionsErrorElm.classList.contains('error-show') ) {
      this.optionsErrorElm.classList.remove('error-show');
    }
  },

  passwordValidate: function(elm) {
    var validationPassed = w.optly.mrkt.utils.checkComplexPassword(elm.value);

    if(!validationPassed) {
      this.optionsErrorElm.innerHTML = 'Password Minimum 8 characters, mix of upper/lowercase letters, numbers or symbols';
    }

    return validationPassed;
  },

  success: function(e) {
    var resp = this.parseResponse(e);

    if(resp) {
      w.optly.mrkt.Oform.trackLead({
        Signup_Platform__c: 'ios',
        email: this.formElm.querySelector('[name="email"]').value
      }, e);

      w.Munchkin.munchkinFunction('visitWebPage', {url: '/event/ios-form-signup'});
      
      if(w.optly.mrkt.automatedTest()) {
        document.body.dataset.formSuccess = this.formElm.getAttribute('action');
      } else {
        window.setTimeout(function() {
          window.location = '/mobile/first-project';
        }, 1000);
      }

      $(this.formElm).find('button[type="submit"]').addClass('successful-submit');
    }

  }

};

window.optly.mrkt.form.mobileMvpp = function(argumentsObj) {
  var constructorArgs = {
    formId: argumentsObj.formId,
    dialogId: argumentsObj.dialogId,
    prototype: mobileMvppHelper
  };

  return window.optly.mrkt.form.HelperFactory(constructorArgs);

};
