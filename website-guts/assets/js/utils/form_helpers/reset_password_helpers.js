window.optly.mrkt.form = window.optly.mrkt.form || {};

var resetPasswordHelper = {

  customErrorMessage: function (elm, message) {
    if(message) {
      elm.innerHTML = message;
    }
  },

  showOptionsError: function (message){
    if(!document.body.classList.contains('error-state')) {
      document.body.classList.add('error-state');
    }

    if( !this.optionsErrorElm.classList.contains('error-show') ) {
      this.optionsErrorElm.classList.add('error-show');
    } 

    if ( this.optionsErrorElm.classList.contains('success-show') ) {
      this.optionsErrorElm.classList.remove('success-show');
    }

    this.optionsErrorElm.innerHTML = message;
  },

  showOptionsSuccess: function (message){
    if(document.body.classList.contains('error-state')) {
      document.body.classList.remove('error-state');
    }

    if( this.optionsErrorElm.classList.contains('error-show') ) {
      this.optionsErrorElm.classList.remove('error-show');
    } 

    if ( !this.optionsErrorElm.classList.contains('success-show') ) {
      this.optionsErrorElm.classList.add('success-show');
    }

    this.optionsErrorElm.innerHTML = message;
    
  },

  addError: function(elm) {
    if(!document.body.classList.contains('error-state')) {
      document.body.classList.add('error-state');
    }
    if( !elm.classList.contains('error-show') ) {
      elm.classList.add('error-show');
    }
  },

  removeError: function(elm) {
    if(document.body.classList.contains('error-state')) {
      document.body.classList.remove('error-state');
    }
    if( elm.classList.contains('error-show') ) {
      elm.classList.remove('error-show');
    }
  },

  bindEmailValidation: function() {
    var emailInput = this.formElm.querySelector('[name="email"]'),
      emailErrorElm = this.formElm.querySelector('.email-related'),
      emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      lastErrorState;

    $(emailInput).on('keyup focusout', function() {
      var errorState;

      if(emailInput.value.length === 0) {
        errorState = true;
        this.customErrorMessage(emailErrorElm, 'This field is required.');
      } else if( !emailRegEx.test(emailInput.value) ) {
        errorState = true;
        this.customErrorMessage(emailErrorElm, 'Please enter a valid email address.');
      }

      if(errorState !== lastErrorState) {

        if(errorState) {
          $.each([emailInput, emailErrorElm], function(i, elm) {
            this.addError(elm);
          }.bind(this));
        } else {
          $.each([emailInput, emailErrorElm], function(i, elm) {
            this.removeError(elm);
          }.bind(this));
        }

      }

      lastErrorState = errorState;
    }.bind(this));
  },

  load: function(e) {
    var resp = JSON.parse(e.target.responseText);

    if(e.target.status !== 200) {
      window.analytics.track('password reset fail', {
        category: 'account',
        label: w.location.pathname
      });
      this.showOptionsError(resp.error);
      this.processingRemove({callee: 'load'});
    } else {
      window.analytics.track('password reset', {
        category: 'account',
        label: w.location.pathname
      });
      this.showOptionsSuccess(resp.message);
      this.processingRemove({callee: 'load', retainDisabled: true});
    }

  }

};

window.optly.mrkt.form.resetPassword = function(argumentsObj) {
  var constructorArgs = {
    formId: argumentsObj.formId,
    dialogId: argumentsObj.dialogId,
    init: 'bindEmailValidation',
    prototype: resetPasswordHelper
  };

  return new window.optly.mrkt.form.HelperFactory(constructorArgs);

};
