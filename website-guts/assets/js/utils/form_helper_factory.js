var tr = require('./client-tr');

window.optly.mrkt.form = window.optly.mrkt.form || {};

window.optly.mrkt.form.HelperFactory = function(scopeObj) {
  function Const() {
    this.formElm = document.getElementById(scopeObj.formId);

    if(scopeObj.dialogId) {
      this.dialogElm = document.getElementById(scopeObj.dialogId);
    }

    if(this.formElm.getElementsByClassName('options').length > 0) {
      this.optionsErrorElm = this.formElm.getElementsByClassName('options')[0].querySelector('p:last-child');
    }

    if(scopeObj.characterMessageSelector) {
      this.characterMessageElm = this.formElm.querySelector( scopeObj.characterMessageSelector );
    }

    if(scopeObj.init) {
      this[ scopeObj.init ]();
    }

    this.bodyClass = document.body.classList;
    this.inputs = Array.prototype.slice.call( this.formElm.getElementsByTagName('input') );

    this.inputs.push(this.formElm.querySelector('button[type="submit"]'));

    this.focusin();
  }

  // Remove the error classes when the user focuses on an input
  Const.prototype.focusin = function(){
    $.each(this.inputs, function(index, input) {
      if  (!!input && input.type !== 'submit') {
        $(input).on('focus', function(e) {
          var $target = $(e.target);
          $target.removeClass('error-show oform-error-show');
          $('.' + $target.attr('name') + '-related').removeClass('oform-error-show error-show');
        });
      }
    });
  };

  var defaultHelpers = {
    errorMessages: {
      DEFAULT: tr('Please Correct Form Errors'),
      UNEXPECTED: tr('An unexpected error occurred. Please contact us if the problem persists.'),
      REQUIRED: tr('Required'),
      REQUIRED_FIELD: tr('This field is required'),
      VALID_EMAIL: tr('Please enter a valid email address.'),
      INVALID_PASSWORD: tr('Password is Invalid'),
      PASSWORD_CHAR: tr('Password Minimum 8 characters, mix of upper/lowercase letters, numbers or symbols'),
      ENTER_SAME_VAL: tr('Please enter the same value as above'),
      DIALOG_DEFAULT: tr('We\'ve encoutered an unexpected error.'),
      DIALOG_ACCOUNT: tr('There was an error creating your account.'),
      SERVER_MESSAGES: {
        'Account already exists.': tr('Account already exists.'),
        'Please enter a real email address.': tr('Please enter a real email address.'),
        'Email sent.': tr('Email sent.'),
        'Account was not found.': tr('Account was not found.'),
        'Incorrect email or password.': tr('Incorrect email or password.')
      }
    },

    successMessages: {
      DEFAULT: tr('Submitted Successfully')
    },

    showOptionsError: function (message){
      if(typeof message === 'object') {
        if(message.serverMessage) {
          // translate the message if it is from the server response
          message = this.errorMessages.SERVER_MESSAGES[message.serverMessage] || this.errorMessages.DIALOG_DEFAULT;
        } else {
          // get the success message translate from the constant dictionary
          message = this.errorMessages[message.error];
        }
        this.optionsErrorElm.innerHTML = message;
      } else if (this.optionsErrorElm.innerHTML.length === 0) {
        // if the error display element has no content enter the default message
        this.optionsErrorElm.innerHTML = this.errorMessages.DEFAULT;
      }

      if(!document.body.classList.contains('error-state')) {
        document.body.classList.add('error-state');
      }
      if( !this.optionsErrorElm.classList.contains('error-show') ) {
        this.optionsErrorElm.classList.add('error-show');
      }
    },

    showOptionsSuccess: function (message){
      if(typeof message === 'object') {
        if(message.serverMessage) {
          // translate the message if it is from the server response
          message = tr(message.serverMessage);
        } else {
          // get the success message translate from the constant dictionary
          message = this.successMessages[message.success];
        }
        this.optionsErrorElm.innerHTML = message;
      } else if (this.optionsErrorElm.innerHTML.length === 0) {
        // if the error display element has no content enter the default message
        this.optionsErrorElm.innerHTML = this.errorMessages.DEFAULT;
      }

      if(document.body.classList.contains('error-state')) {
        document.body.classList.remove('error-state');
      }

      if( this.optionsErrorElm.classList.contains('error-show') ) {
        this.optionsErrorElm.classList.remove('error-show');
      }

      if ( !this.optionsErrorElm.classList.contains('success-show') ) {
        this.optionsErrorElm.classList.add('success-show');
      }

    },

    customErrorMessage: function (elm, message) {
      if(typeof message === 'object') {
        message = this.errorMessages[message.error];
        elm.innerHTML = message;
      } else {
        elm.innerHTML = this.errorMessages.REQUIRED;
      }
    },

    showErrorDialog: function(message) {
      if(typeof message === 'object') {
        message = this.errorMessages[message.error];
      }
      window.optly.mrkt.errorQ.push([
        'logError',
        {
          error: message ? message : this.errorMessages.DIALOG_DEFAULT
        }
      ]);
    },

    addErrors: function(elmArr) {
      if(!document.body.classList.contains('error-state')) {
        document.body.classList.add('error-state');
      }

      if(elmArr) {
        $.each(elmArr, function(i, elm) {
          if( !elm.classList.contains('error-show') ) {
            elm.classList.add('error-show');
          }
        });
      }
    },

    removeErrors: function(elmArr, retainBodyClass) {
      if( arguments.length === 0 || (!retainBodyClass && document.body.classList.contains('error-state')) ) {
        document.body.classList.remove('error-state');
      }

      if(elmArr) {
        $.each(elmArr, function(i, elm) {
          if( elm.classList.contains('error-show') ) {
            elm.classList.remove('error-show');
          }
        });
      }
    },

    parseResponse: function(e) {
      var resp,
        responseSuccess = true;

      try {
        resp = JSON.parse(e.XHR.responseText);
      } catch(err) {
        var action = this.formElm.getAttribute('action');
        window.analytics.track(action, {
          category: 'api error',
          label: 'response contains invalid JSON: ' + err
        }, {
          integrations: {
            Marketo: false
          }
        });
      }

      if(e.XHR && e.XHR.status !== 200) {
        w.analytics.track(this.formElm.getAttribute('action'), {
          category: 'api error',
          label: 'status not 200: ' + e.XHR.status
        }, {
          integrations: {
            Marketo: false
          }
        });

        responseSuccess = false;

      }

      if(responseSuccess) {
        // accounts for if there is a parse error we still want to continue with success logic
        // use an empty object for boolean logic and in case subsequent logic calls methods on the response
        return resp || {};
      } else {
        if(resp && resp.error) {
          $('body').addClass('oform-error').removeClass('oform-processing');
          // if the server response has an error property
          this.showOptionsError({serverMessage: resp.error});
          //handle invalid emails
          if(resp.error === 'Please enter a real email address.'){
            w.analytics.track('email not valid', {
              category: $(this.formElm).attr('action') + '/invalid-email',
              label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
            });
            if(typeof w.optly.mrkt.activeModals[$(this.formElm).attr('id')] === 'object'){
              var oFormInstance = w.optly.mrkt.activeModals[$(this.formElm).attr('id')];
              var element = $(this.formElm).find('input[name="email"]')[0];
              oFormInstance.options.adjustClasses(element, false);
              var message = this.errorMessages.SERVER_MESSAGES[resp.error];
              $(this.formElm).find('.email-related').text(message);
            }
          }
        } else {
          this.showOptionsError({error: 'UNEXPECTED'});
        }
        this.processingRemove({callee: 'load'});

        return responseSuccess;
      }

    },

    redirectHelper: function(options) {
      if(window.optly.mrkt.automatedTest()) {
        if(options.bodyClass) {
          document.body.classList.add(options.bodyClass);
        }
        // iterate through data attributes and apply them to the body
        if(options.bodyData) {
          for(var dataAttr in options.bodyData) {
            document.body.dataset[dataAttr] = options.bodyData[dataAttr];
          }
        }
      } else {
        window.setTimeout(function() {
          window.location = options.redirectPath;
        }, 500);
      }
    }

  };

  var processingHelpers = {

    handleDisable: function(disableState) {
      var inputs = this.inputs;

      if(inputs.indexOf(null) !== -1) {
        inputs.splice(inputs.indexOf(null), 1);
      }

      if(disableState === 'add') {
        $.each(inputs, function(i, input) {
          input.setAttribute('disabled', '');
        });
      } else if (disableState === 'remove') {
        $.each(inputs, function(i, input) {
          input.removeAttribute('disabled');
        });
      }

    },

    processingAdd: function(argsObj) {
      if( !this.bodyClass.contains('processing-state') ) {
        this.bodyClass.add('processing-state');
      }

      if(!argsObj || !argsObj.omitDisabled) {
        this.handleDisable('add');
      }

      return true;
    },

    processingRemove: function(argsObj) {
      if( this.bodyClass.contains('processing-state') ) {
        if(( argsObj && argsObj.callee === 'done' && ( this.bodyClass.contains('oform-error') || this.bodyClass.contains('error-state') ) ) || argsObj.callee === 'load' || argsObj.callee === 'error') {
          this.bodyClass.remove('processing-state');
          if(!argsObj || !argsObj.retainDisabled) {
            this.handleDisable('remove');
          }
        }
      }

      return true;
    }
  };

  $.extend(Const.prototype, processingHelpers, defaultHelpers, scopeObj.prototype);

  return new Const();

};
