window.optly.mrkt.form = window.optly.mrkt.form || {};

var orgForm = {

  getRelatedElm: function(input) {
    return this.formElm.querySelector('.' + input.getAttribute('name') + '-related');
  },

  validateForm: function() {
    var segmentObj = {},
    formError = false,
    errorInputs = [],
    emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.processingAdd();
    this.removeErrors();
    $.each(this.inputs, function(i, input) {
      if(input.getAttribute('type') !== 'submit' && input.hasAttribute('required')) {
        // check if there is a form error
        if ( input.value === '' || ( input.getAttribute('name') === 'Email' && !emailRegEx.test(input.value) ) ) {
          if(!formError) {
            formError = true;
          }
          errorInputs.push(input, this.getRelatedElm(input));
        }
      }
      if(input.getAttribute('type') !== 'submit') {
        segmentObj[input.getAttribute('name')] = input.value;
      }
    }.bind(this));

    if(!formError) {
      this.load(segmentObj);
    } else {
      // order is important here, must add errors before removing processing of inputs will stay disabled
      this.addErrors(errorInputs);
      this.processingRemove({callee: 'done'});
      this.showOptionsError({error: 'DEFAULT'});
    }
  },

  load: function(segmentObj) {
    var button = this.formElm.querySelector('button');

    var anonymousVisitorIdentifier = window.optly.mrkt.utils.randomString();
    w.analytics.identify(anonymousVisitorIdentifier, segmentObj,
      { integrations: { Marketo: true } }
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

