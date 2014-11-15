window.optly.mrkt.form = window.optly.mrkt.form || {};

var androidHelper = {

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

  success: function(hideShowContent) {
    var submitButton = this.formElm.querySelector('[type="submit"]'),
      formEmail = this.formElm.querySelector('input[name="email"]').value;

    $.each(hideShowContent, function(i, elm) {
      var $elm = $(elm);
      if ( $elm.hasClass('is-visible') ) {
        $elm.addClass('is-hidden').removeClass('is-visible');
      } else {
        $elm.addClass('is-visible').removeClass('is-hidden');
      }
    });

    //tracking code goes here
    w.analytics.identify(formEmail, {

      Inbound_Lead_Form_Type__c: 'Android Developer Preview',
      LeadSource: 'Website',
      LeadSourceCategory: 'Content',
      LeadSourceSubcategory: 'PMM',
      email: formEmail
    }, {

      Integrations: {
        Marketo: true
      }

    });

    w.Munchkin.munchkinFunction('visitWebPage', {
      url: '/event/form-submit-android-preview'
    });

    w.analytics.track('android preview success', {

      category: 'forms'

    });
  }

};

window.optly.mrkt.form.android = function(argumentsObj) {
  var constructorArgs = {
    formId: argumentsObj.formId,
    dialogId: argumentsObj.dialogId,
    prototype: androidHelper
  };

  return window.optly.mrkt.form.HelperFactory(constructorArgs);

};
