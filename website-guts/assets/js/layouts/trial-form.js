w.optly.mrkt.inlineFormLabels();

var param = w.optly.mrkt.utils.getURLParameter;

var medium = param('utm_medium');

if(medium){
  $('#utm_medium').val(medium);
}

//form
new Oform({
  selector: '#seo-form',
  middleware: function(XhrObj, data){
    return w.optly.mrkt.utils.Base64.encode(data);
  }
})
.on('before', w.optly.mrkt.Oform.before)
.on('validationError', w.optly.mrkt.Oform.validationError)
.on('load', function(event){
  var email,
      url,
      name,
      phone,
      token,
      response,
      source;
  response = JSON.parse(event.target.responseText);
  email = d.getElementById('email').value;
  url = d.getElementById('url').value;
  name = d.getElementById('name').value;
  phone = d.getElementById('phone').value;
  token = response.token;
  source = window.optly.mrkt.source;
  w.analytics.identify(email,{
    email: email,
    name: name,
    phone: phone,
    website: url,
    token: token,
    utm_Campaign__c: source.utm.campaign,
    utm_Content__c: source.utm.content,
    utm_Medium__c: source.utm.medium,
    utm_Source__c: source.utm.source,
    utm_Keyword__c: source.utm.keyword,
    otm_Campaign__c: source.otm.campaign,
    otm_Content__c: source.otm.content,
    otm_Medium__c: source.otm.medium,
    otm_Source__c: source.otm.source,
    otm_Keyword__c: source.otm.keyword,
    Signup_Platform__c: source.signupPlatform
  }, {
    integrations: {
      Marketo: true
    }
  });
  w.analytics.track('account created', {
    category: 'account',
    label: w.location.pathname
  }, {
    Marketo: true
  });
  setTimeout(function(){
    w.location = '/edit?url=' + url;
  }, 500);
})
.on('done', w.optly.mrkt.Oform.done);
