window.optly.mrkt.form = window.optly.mrkt.form || {};

var orgForm = {
  
  showOptionsError: function (message){
    if(!document.body.classList.contains('error-state')) {
      document.body.classList.add('error-state');
    }
    if( !this.optionsErrorElm.classList.contains('error-show') ) {
      this.optionsErrorElm.classList.add('error-show');
    }
    this.optionsErrorElm.innerHTML = message;
  },

  formErrorBodyClass: function(errorState) {
    if(errorState) {
      document.body.classList.add('error-state');
    } else {
      document.body.classList.remove('error-state');
    }
  },

  showFormFieldError: function(input) {
    input.classList.add('error-show');
    this.formElm.querySelector('.' + input.getAttribute('name') + '-related').classList.add('error-show');
  },

  validateForm: function() {
    var segmentObj = {},
    formError = false,
    emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.processingAdd();
    if(document.body.classList.contains('error-state')) {
      this.formErrorBodyClass(formError);
    }
    $.each(this.inputs, function(i, input) {
      if(input.getAttribute('type') !== 'submit' && input.hasAttribute('required')) {
        if ( input.value === '' || ( input.getAttribute('name') === 'Email' && !emailRegEx.test(input.value) ) ) {
          this.showFormFieldError(input);
          if(!formError) {
            formError = true;
            this.formErrorBodyClass(formError);
            this.showOptionsError('Please Enter Required Fields');
          }
        }
      }
      if(input.getAttribute('type') !== 'submit') {
        segmentObj[input.getAttribute('name')] = input.value;
      }
    }.bind(this));

    if(!formError) {
      this.load(segmentObj);
    } else {
      this.processingRemove({callee: 'done'});
    }
  },

  load: function(segmentObj) {
    var button = this.formElm.querySelector('button');

    w.analytics.identify(
      segmentObj.email,
      segmentObj,
      { integrations: { Marketo: true }}
    );

    w.analytics.track('form/submit/optimizely.org', {}, { Marketo: true });

    window.setTimeout(function() {
      this.processingRemove({callee: 'load', retainDisabled: true});
      button.classList.add('successful-submit');
    }.bind(this), 1000);

  }
};

window.optly.mrkt.form.orgForm = function(argumentsObj) {
  var constructorArgs = {
    formId: argumentsObj.formId,
    prototype: orgForm
  };

  return window.optly.mrkt.form.HelperFactory(constructorArgs);

};

