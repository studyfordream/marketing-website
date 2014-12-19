if(Modernizr.placeholder){
  w.optly.mrkt.inlineFormLabels();
}

d.querySelector('[name="hidden"]').value = 'touched';

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
