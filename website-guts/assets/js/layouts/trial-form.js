w.optly.mrkt.inlineFormLabels();

$('[name="hidden"]').val('touched');

document.querySelector('[name="hidden"]').value = 'touched';

//form
new Oform({
  selector: '#seo-form'
})
.on('before', w.optly.mrkt.Oform.before)
.on('validationError', w.optly.mrkt.Oform.validationError)
.on('load', function(event){
  w.optly.mrkt.Oform.trackLead({
    email: d.getElementById('email').value,
    url: d.getElementById('url').value,
    name: d.getElementById('name').value,
    phone: d.getElementById('phone').value
  }, event);
  setTimeout(function(){
    //w.location = '/edit?url=' + url;
  }, 500);
})
.on('done', w.optly.mrkt.Oform.done);
