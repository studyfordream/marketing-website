window.optly.mrkt.form = window.optly.mrkt.form || {};

window.optly.mrkt.form.HelperFactory = function(scopeObj) {
  function Const() {
    this.formElm = document.getElementById(scopeObj.formId);

    if(scopeObj.dialogId) {
      this.dialogElm = document.getElementById(scopeObj.dialogId);
    }
    
    this.optionsErrorElm = this.formElm.getElementsByClassName('options')[0].querySelector('p:last-child');

    if(scopeObj.characterMessageSelector) {
      this.characterMessageElm = this.formElm.querySelector( scopeObj.characterMessageSelector );
    }

    if(scopeObj.init) {
      this[ scopeObj.init ]();
    }

  }

  
  Const.prototype = scopeObj.prototype;

  return new Const();

};
