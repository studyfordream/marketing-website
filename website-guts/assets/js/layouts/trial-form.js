w.optly.mrkt.inlineFormLabels();

$('[name="hidden"]').val('touched');

document.querySelector('[name="hidden"]').value = 'touched';

//form
new Oform({
  selector: '#seo-form'
})
.on('before', w.optly.mrkt.Oform.before)
.on('validationerror', w.optly.mrkt.Oform.validationError)
.on('error', function(){
  $('#seo-form .error-message').text('An unknown error occured.');
  $('body').addClass('oform-error').removeClass('oform-processing');
})
.on('load', function(event){
  var response = JSON.parse(event.target.responseText);
  if(event.target.status === 200){
    //remove error class from body?
    w.optly.mrkt.Oform.trackLead({
      email: d.getElementById('email').value,
      url: d.getElementById('url').value,
      name: d.getElementById('name').value,
      phone: d.getElementById('phone').value
    }, event);
    /* legacy reporting - to be deprecated */
    w.analytics.track('/free-trial/success', {
      category: 'account',
      label: w.location.pathname
    }, {
      Marketo: true
    });
    /* end legacy reporting */
    setTimeout(function(){
      w.location = '/edit?url=' + d.getElementById('url').value;
    }, 500);
  } else {
    if(response.error && typeof response.error === 'string'){
      //update error message, apply error class to body
      $('#seo-form .error-message').text(response.error);
      $('body').addClass('oform-error').removeClass('oform-processing');
    } else {
      $('#seo-form .error-message').text('An unknown error occured.');
      $('body').addClass('oform-error').removeClass('oform-processing');
    }
  }
})
.on('done', function(){
  if($('body').hasClass('oform-error')){
    $('body').removeClass('oform-processing');
  }
});
