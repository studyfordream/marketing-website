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
    var formEmail = this.formElm.querySelector('input[name="email"]').value,
      source = window.optly.mrkt.source;

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
      utm_Campaign__c: source.utm.campaign,
      utm_Content__c: source.utm.content,
      utm_Medium__c: source.utm.medium,
      utm_Source__c: source.utm.source,
      utm_Keyword__c: source.utm.keyword,
      otm_Campaign__c: source.otm.campaign,
      otm_Content__c: source.otm.content,
      otm_Medium__c: source.otm.medium,
      otm_Source__c: source.otm.source,
      otm_Keyword__c: source.otm.keyword,
      GCLID__c: source.gclid,
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
