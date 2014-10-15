window.optly.mrkt.form = window.optly.mrkt.form || {};

var oformHelper = {
  
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
    var resp = JSON.parse(e.target.responseText);

    if(e.target.status !== 200) {
      this.processingRemove({callee: 'load'});
      this.showOptionsError(resp.error);
      return;
    }

    this.processingRemove({callee: 'load', retainDisabled: true});

  }
};

window.optly.mrkt.form.orgForm = function(argumentsObj) {
  var constructorArgs = {
    formId: argumentsObj.formId,
    prototype: oformHelper
  };

  return window.optly.mrkt.form.HelperFactory(constructorArgs);

};

