window.optly.mrkt.form = window.optly.mrkt.form || {};

var resetPasswordHelper = {

  validationLogic: function(emailInput, emailErrorElm, errorState) {
    var emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      lastErrorState;

      if(emailInput.value.length === 0) {
        errorState = true;
        this.customErrorMessage(emailErrorElm, {error: 'REQUIRED_FIELD'});
      } else if( !emailRegEx.test(emailInput.value) ) {
        errorState = true;
        this.customErrorMessage(emailErrorElm, {error: 'VALID_EMAIL'});
      }

      if(errorState !== lastErrorState) {

        if(errorState) {
          this.addErrors([emailInput, emailErrorElm]);
        } else {
          this.removeErrors([emailInput, emailErrorElm]);
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

      this.removeErrors([emailInput, emailErrorElm]);

    }.bind(this));

  },

  load: function(e) {
    var resp = this.parseResponse(e),
      submitButton = this.formElm.querySelector('[type="submit"]'),
      closeButton = this.formElm.querySelector('[data-modal-btn="close"]');

    if(resp) {
      window.analytics.track('password reset', {
        category: 'account',
        label: window.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
      });
      submitButton.classList.add('hide-button');
      closeButton.classList.remove('hide-button');
      this.showOptionsSuccess({serverMessage: resp.message});
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
