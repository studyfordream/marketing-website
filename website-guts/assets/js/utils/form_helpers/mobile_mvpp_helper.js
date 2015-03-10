window.optly.mrkt.form = window.optly.mrkt.form || {};

var mobileMvppHelper = {

  passwordValidate: function(elm) {
    var validationPassed = w.optly.mrkt.utils.checkComplexPassword(elm.value);

    if(!validationPassed) {
      this.optionsErrorElm.innerHTML = this.errorMessages.PASSWORD_CHAR;
    }

    return validationPassed;
  },

  success: function(returnData) {
    var parsedResp = this.parseResponse(returnData),
        form = this.formElm.getAttribute('id');

    if(parsedResp) {
      w.optly.mrkt.Oform.trackLead({
        response: parsedResp,
        requestPayload: returnData.requestPayload
      });

      w.analytics.track('/event/ios-form-signup', {}, { 'All': false, 'Marketo': true });

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
