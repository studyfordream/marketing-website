window.optly.mrkt.form = window.optly.mrkt.form || {};

var mobileMvppHelper = {

  passwordValidate: function(elm) {
    var validationPassed = w.optly.mrkt.utils.checkComplexPassword(elm.value);

    if(!validationPassed) {
      this.optionsErrorElm.innerHTML = this.errorMessages.PASSWORD_CHAR;
    }

    return validationPassed;
  },

  success: function(e) {
    var resp = this.parseResponse(e),
      pageData = {
        Signup_Platform__c: 'ios',
        iOS__c: 'true',
        email: this.formElm.querySelector('[name="email"]').value
      };

    if(resp) {
      w.optly.mrkt.Oform.trackLead({
        formElm: this.formElm,
        pageData: pageData,
        XHRevent: e
      });

      w.Munchkin.munchkinFunction('visitWebPage', {url: '/event/ios-form-signup'});

      this.redirectHelper({
        redirectPath: w.apiDomain + '/mobile/first-project',
        bodyData: {
          formSuccess: this.formElm.getAttribute('action')
        }
      });

      $(this.formElm).find('button[type="submit"]').addClass('successful-submit');
    }

  }

};

window.optly.mrkt.form.mobileMvpp = function(argumentsObj) {
  var constructorArgs = {
    formId: argumentsObj.formId,
    dialogId: argumentsObj.dialogId,
    prototype: mobileMvppHelper
  };

  return window.optly.mrkt.form.HelperFactory(constructorArgs);

};
