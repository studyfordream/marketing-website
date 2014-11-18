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

    showErrorDialog: function(message) {
      window.optly.mrkt.errorQ.push([
        'logError',
        {
          error: message,
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
        if(( argsObj && argsObj.callee === 'done' && ( this.bodyClass.contains('oform-error') || this.bodyClass.contains('error-state') ) ) || argsObj.callee == 'load' || argsObj.callee == 'error') {
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
