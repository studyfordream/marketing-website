window.optly.mrkt.form = window.optly.mrkt.form || {};

var CreateAccountConst = function(scopeObj) {
  $.each(scopeObj, function(key, val){
    this[key] = val;
  }.bind(this));
};

CreateAccountConst.prototype = {

  customErrorMessage: function (elm, message) {
    if(message) {
      elm.innerHTML = message;
    }
  },

  showOptionsError: function (message){
    if(!document.body.classList.contains('error-state')) {
      document.body.classList.add('error-state');
    }
    if( !this.optionsErrorElm.classList.contains('error-show') ) {
      this.optionsErrorElm.classList.add('error-show');
      this.optionsErrorElm.innerHTML = message;
    }
  },

  password1Validate: function(elm) {
    var validationPassed = w.optly.mrkt.utils.checkComplexPassword(elm.value),
      errorElm = this.formElm.getElementsByClassName('password1-related')[0],
      message;

    if(!validationPassed) {
      if(elm.value.length === 0) {
        message = 'This field is required';
      } else {
        message = 'Password is Invalid';
      }
      this.characterMessageElm.classList.add('error-show');
    } else if (validationPassed && this.characterMessageElm.classList.contains('error-show')) {
      this.characterMessageElm.className = this.characterMessageElm.classList.remove('error-show');
    }

    this.customErrorMessage(errorElm, message);

    return validationPassed;
  },

  password2Validate: function(elm) {
    var password1 = this.formElm.querySelector('[name="password1"]'),
      errorElm = this.formElm.getElementsByClassName('password2-related')[0],
      message;

    if(elm.value.length === 0) {
      message = 'This field is required';
    } else if (elm.value !== password1.value) {
      message = 'Please enter the same value again';
    }

    this.customErrorMessage(errorElm, message);

    return elm.value === password1.value && w.optly.mrkt.utils.checkComplexPassword(password1.value);
  },

  load: function(e) {
    var formElm = this.formElm;
    var resp = JSON.parse(e.target.responseText);

    if(e.target.status !== 200) {
      this.showOptionsError(resp.error);
      return;
    }

    w.optly.mrkt.Oform.trackLead({
      name: formElm.querySelector('[name="name"]').value,
      email: formElm.querySelector('[name="email"]').value,
      phone: formElm.querySelector('[name="phone_number"]').value
    }, e);
    
    window.optly.mrkt.modal.close({ modalType: 'signup', track: false });
    window.optly_q.acctData = resp;
    window.optly_q.push([window.optly.mrkt.showUtilityNav, 'acctData']);
  }

};

window.optly.mrkt.form.createAccount = function(argumentsObj) {
  var constructorArgs = {};
  constructorArgs.formElm = document.getElementById(argumentsObj.formId);
  if (argumentsObj.dialogId) {
    constructorArgs.dialogElm = document.getElementById(argumentsObj.dialogId);
  }
  constructorArgs.optionsErrorElm = constructorArgs.formElm.getElementsByClassName('options')[0].querySelector('p:last-child');
  constructorArgs.characterMessageElm = constructorArgs.formElm.getElementsByClassName('password-req')[0];

  return new CreateAccountConst(constructorArgs);

};