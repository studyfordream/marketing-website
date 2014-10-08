var createExpHelperInst = window.optly.mrkt.form.createExp({formId: 'create-exp-form'});

$(createExpHelperInst.formElm).on('submit', function(e) {
  var uri,
    validationError = false;

  e.preventDefault();
  
  validationError = createExpHelperInst.validateInputs();

  if(!validationError) {

    createExpHelperInst.processingAdd();

    uri = createExpHelperInst.getUri();

    w.analytics.track('create experiment submit', {
      category: 'experiment',
      label: w.location.pathname
    }, {
      Marketo: true
    });

    w.setTimeout(function() {
      window.location.href = uri;
    }, 500);

  } 
  

});
