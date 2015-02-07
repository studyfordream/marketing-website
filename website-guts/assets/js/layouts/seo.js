$('[name="hidden"]').val('touched');

document.querySelector('[name="hidden"]').value = 'touched';

var xhrInitiationTime;

//track focus on form fields
$('#seo-form input:not([type="hidden"])').each(function(){
  $(this).focus(function(){
    //put all the information in the event because we'll want to use this as a goal in optimizely
    w.analytics.track($(this).closest('form').attr('id') + ' ' + $(this).attr('name') + ' focus', {
      category: 'forms'
    }, {
      integrations: {
        'Marketo': false
      }
    });
  });
});

//form
new Oform({
  selector: '#seo-form'
})
.on('before', function(){
  w.analytics.track('/free-trial/submit', {
    category: 'account',
    label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
  }, {
    integrations: {
      'Marketo': false
    }
  });
  xhrInitiationTime = new Date();
  return w.optly.mrkt.Oform.before();
})
.on('validationerror', w.optly.mrkt.Oform.validationError)
.on('error', function(){
  $('#seo-form .error-message').text('An unknown error occured.');
  $('body').addClass('oform-error').removeClass('oform-processing');
})
.on('load', function(event){
  var xhrElapsedTime = new Date() - xhrInitiationTime,
      response = this.parseResponse(event);

  if(response){
    //remove error class from body?
    w.optly.mrkt.Oform.trackLead({
      email: d.getElementById('email').value,
      url: d.getElementById('url').value,
      name: d.getElementById('name').value,
      phone: d.getElementById('phone').value
    }, event);
    //[> legacy reporting - to be deprecated <]
    w.analytics.track('/free-trial/success', {
      category: 'account',
      label: w.location.pathname
    }, {
      'Marketo': false
    });
    w.Munchkin.munchkinFunction('visitWebPage', {
      url: '/free-trial/success'
    });
    w.analytics.page('/account/create/success', {
      integrations: {
        'Marketo': false
      }
    });
    w.analytics.page('/free-trial/success', {
      integrations: {
        'Marketo': false
      }
    });

    //for phantom tests
    document.body.dataset.formSuccess = document.getElementById('seo-form').getAttribute('action');

    setTimeout(function(){
      w.location = 'https://www.optimizely.com/welcome';
    }, 1000);
  }
})
.on('done', function(){
  if($('body').hasClass('oform-error')){
    $('body').removeClass('oform-processing');
    //report that there were errors in the form
    w.analytics.track('seo-form validation error', {
      category: 'form error',
      label: $('input.oform-error-show').length + ' errors',
    }, {
      integrations: {
        'Marketo': false
      }
    });
  }
});
