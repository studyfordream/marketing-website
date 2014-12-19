if(Modernizr.placeholder){
  w.optly.mrkt.inlineFormLabels();
}

if(!Modernizr.touch){
  $('#url').focus();
}

d.querySelector('[name="hidden"]').value = 'touched';

//track focus on form fields
$('#seo-form input:not([type="hidden"])').each(function(){
  $(this).one('blur', function(){
    //put all the information in the event because we'll want to use this as a goal in optimizely
    w.analytics.track($(this).closest('form').attr('id') + ' ' + $(this).attr('name') + ' focus',
    {
      category: 'forms'
    },
    {
      integrations: {
        'Marketo': false
      }
    });
  });
});

w.optly.mrkt.trialForm = new Oform({
  selector: '#seo-form',
  customValidation: {
    'url-input': function(element){
      console.log('value: ' + element.value);
      var urlRegex = /.+\..+/;
      return urlRegex.test(element.value);
    }
  }
})
.on('before', function(){
  w.alert('before event');
  return true;
}).on('validationerror', function(element){
  w.alert('validation error: ' + element.getAttribute('name'));
}).on('load', function(){
  w.alert('load event');
}).on('done', function(){
  w.alert('done event');
});
