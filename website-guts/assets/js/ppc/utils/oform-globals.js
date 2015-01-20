w.optly.mrkt.Oform = {};

w.optly.mrkt.Oform.before = function(){
  
  $('body').addClass('oform-process');

  return true;

};

w.optly.mrkt.Oform.validationError = function(element){

  w.optly.mrkt.formHadError = true;

  var elementValue = $(element).val();

  var elementHasValue = elementValue ? 'has value' : 'no value';

  w.analytics.track($(element).closest('form').attr('id') + ' ' + element.getAttribute('name') + ' error submit', {

    category: 'form error',

    label: elementHasValue,

    value: elementValue.length

  }, {

    integrations: {

      Marketo: false

    }

  });

};
