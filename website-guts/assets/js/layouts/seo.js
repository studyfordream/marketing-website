$('[name="hidden"]').val('touched');

document.querySelector('[name="hidden"]').value = 'touched';

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

var seoFormHelperInst = window.optly.mrkt.form.seoForm({formId: 'seo-form'});

new Oform({
  selector: '#seo-form'
})
.on('before', function(){
  seoFormHelperInst.before();
})
.on('validationerror', w.optly.mrkt.Oform.validationError)
.on('error', function(){
  $('#seo-form .error-message').text('An unknown error occured.');
  $('body').addClass('oform-error').removeClass('oform-processing');
})
.on('load', seoFormHelperInst.success.bind(seoFormHelperInst))
.on('done', function(){
  seoFormHelperInst.done();
});
