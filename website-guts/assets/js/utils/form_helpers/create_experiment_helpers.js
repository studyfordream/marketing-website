window.optly.mrkt.form = window.optly.mrkt.form || {};

var createExpHelper = {

  validateInputs: function() {
    var validationError = false;

    $(this.formElm).find('[required]').each(function(i, elm) {
      var $elm = $(elm);

      if($elm.val().length === 0) {
        $('body').addClass('error-state');
        $elm.parent().find('.' + $elm.attr('name') + '-related').addClass('error-show');
        $elm.addClass('error-show');
        validationError = true;
      }
    });

    if(!validationError && document.body.classList.contains('error-state')) {
      document.body.classList.remove('error-state');
    }

    return validationError;
  },

  getUri: function() {
    var params = {},
      orderQ = ['url'];

    $(this.formElm).find('input').each(function(i, inputElm) {
      var inputName = inputElm.getAttribute('name');
      if(!!inputElm.value) {
        params[ inputName ] = inputElm.value;
        
        if(orderQ.indexOf(inputName) === -1) {
          orderQ.push(inputName);
        }

      }
    });

    return window.optly.mrkt.utils.param('/edit', params, orderQ);

  }

};

window.optly.mrkt.form.createExp = function(argumentsObj) {
  var constructorArgs = {
    formId: argumentsObj.formId,
    dialogId: argumentsObj.dialogId,
    prototype: createExpHelper
  };
  return window.optly.mrkt.form.HelperFactory(constructorArgs);

};
