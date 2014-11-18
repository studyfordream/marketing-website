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
    var formEmail = this.formElm.querySelector('input[name="email"]').value;

    window.setTimeout(function() {
      $.each(hideShowContent, function(i, elm) {
        var $elm = $(elm);
        if ( $elm.hasClass('is-visible') ) {
          $elm.addClass('leave');
        } else {
          $elm.addClass('enter');
        }
      });
    }, 1000);

    //tracking code goes here
    w.analytics.identify(formEmail, {

      Inbound_Lead_Form_Type__c: 'Android Developer Preview',
      Lead_Source__c: 'Website',
      Lead_Source_Category__c: 'Content',
      Lead_Source_Subcategory__c: 'PMM',
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
