window.optly.mrkt.form = window.optly.mrkt.form || {};

var mobileMvppHelper = {

  showOptionsError: function (message){
    if(message) {
      this.optionsErrorElm.innerHTML = message;
    }
    if(!document.body.classList.contains('error-state')) {
      document.body.classList.add('error-state');
    }
    if( !this.optionsErrorElm.classList.contains('error-show') ) {
      this.optionsErrorElm.classList.add('error-show');
    }
  },

  customErrorMessage: function (elm, message) {
    if(message) {
      elm.innerHTML = message;
    } else {
      elm.innerHTML = 'Required';
    }
  },

  showErrorDialog: function() {
    window.optly.mrkt.errorQ.push([
      'logError',
      {
        error: 'There was an error creating your account.',
      }
    ]);
  },

  removeErrors: function() {
    if(document.body.classList.contains('error-state')) {
      document.body.classList.remove('error-state');
    }
    if( this.optionsErrorElm.classList.contains('error-show') ) {
      this.optionsErrorElm.classList.remove('error-show');
    }
  },

  passwordConfirm: function(password1, password2){
    var password2ErrorElm = this.formElm.querySelector('.password2-related');

    if ( password2.value.length > 0 && password1.value !== password2.value ) {
      this.addErrors([password2, password2ErrorElm]);
      this.customErrorMessage(password2ErrorElm, 'Please enter the same value as above');
    }
    //remove local error classes but do not remove body error class just in case
    else {
      this.passed = true;
      this.removeErrors([password2, password2ErrorElm]);
    }
  },

  passwordValidate: function(elm) {
    var validationPassed = w.optly.mrkt.utils.checkComplexPassword(elm.value);

    if(!validationPassed) {
      this.optionsErrorElm.innerHTML = 'Password Minimum 8 characters, mix of upper/lowercase letters, numbers or symbols';
    }

    return validationPassed;
  },
  
  scrollTop: function() {
    $('html,body').animate({
      scrollTop: 0
    }, 1000);
  },

  success: function(e) {
    var formElm = this.formElm,
      resp;

    try {
      resp = JSON.parse(e.target.responseText);
    } catch(err) {
      var action = this.formElm.getAttribute('action');
      window.analytics.track(action, {
        category: 'api error',
        label: 'response contains invalid JSON: ' + err
      });
    }

    if(e.target.status !== 200) {
      this.processingRemove({callee: 'load'});
      if(resp && resp.error) {
        this.showOptionsError(resp.error);
      } else {
        this.showOptionsError('An unexpected error occurred. Please contact us if the problem persists.');
      }

      w.analytics.track(this.formElm.getAttribute('action'), {
        category: 'api error',
        label: 'status not 200: ' + e.target.status
      });

      this.showErrorDialog();
    } else {
      w.optly.mrkt.Oform.trackLead({
        email: formElm.querySelector('[name="email"]').value
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