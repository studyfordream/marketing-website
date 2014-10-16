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

  load: function(e) {
    var button;

    if(e.target.status !== 200) {
      this.processingRemove({callee: 'load'});
      this.showOptionsError('Form Response Error');
      return;
    }

    this.processingRemove({callee: 'load', retainDisabled: true});

    button = this.formElm.querySelector('button');

    button.classList.add('successful-submit');

  }
};

window.optly.mrkt.form.orgForm = function(argumentsObj) {
  var constructorArgs = {
    formId: argumentsObj.formId,
    prototype: orgForm
  };

  return window.optly.mrkt.form.HelperFactory(constructorArgs);

};

