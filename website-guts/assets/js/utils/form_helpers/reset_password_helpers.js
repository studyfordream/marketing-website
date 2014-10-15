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
    var bodyClasses = document.body.classList;

    $.each(bodyClasses, function(i, bodyClass) {
      if(/error/.test(bodyClass)) {
        document.body.classList.remove(bodyClass);
      }
    });
    
    if( elm.classList.contains('error-show') ) {
      elm.classList.remove('error-show');
    }
  },

  validationLogic: function(emailInput, emailErrorElm, errorState) {
    var emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      lastErrorState;

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

  },

  bindEmailValidation: function() {
    var emailInput = this.formElm.querySelector('[name="email"]'),
      emailErrorElm = this.formElm.querySelector('.email-related');

    $(emailInput).on('focusout', function() {
      var errorState;

      this.validationLogic(emailInput, emailErrorElm, errorState);

    }.bind(this));

    $(emailInput).on('focusin', function() {

      $.each([emailInput, emailErrorElm], function(i, elm) {
        this.removeError(elm);
      }.bind(this));

    }.bind(this));

  },

  load: function(e) {
    var resp = JSON.parse(e.target.responseText);
    var submitButton = this.formElm.querySelector('[type="submit"]');
    var closeButton = this.formElm.querySelector('[data-modal-btn="close"]');

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
      submitButton.classList.add('hide-button');
      closeButton.classList.remove('hide-button');
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

  return window.optly.mrkt.form.HelperFactory(constructorArgs);

};
