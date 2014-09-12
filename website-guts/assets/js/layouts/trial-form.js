w.optly.mrkt.inlineFormLabels();

//form
new Oform({
  selector: '#seo-form'
})
.on('before', w.optly.mrkt.Oform.before)
.on('validationError', w.optly.mrkt.Oform.validationError)
.on('load', function(event){
  w.console.log('form response', event);
  var email,
      url,
      name,
      phone,
      token,
      response;
  response = JSON.parse(event.target.responseText);
  email = d.getElementById('email').value;
  url = d.getElementById('url').value;
  name = d.getElementById('name').value;
  phone = d.getElementById('phone').value;
  token = response.token;
  w.analytics.identify(email,{
    email: email,
    name: name,
    phone: phone,
    website: url,
    token: token
  }, {
    integrations: {
      Marketo: true
    }
  });
  w.analytics.track('account created', {
    category: 'account',
    label: w.location.pathname
  }, {
    Marketo: true,
    Optimizely: true
  });
  setTimeout(function(){
    w.console.log('submitted done');
    //w.location = '/edit?url=' + url;
  }, 500);
})
.on('done', w.optly.mrkt.Oform.done);
