new Oform({
  selector: '#signup-form',
  customValidation: {
    password1: function(elm) {
      var message;
      var formElm = document.getElementById('signup-dialog');
      var validationPassed = w.optly.mrkt.utils.checkComplexPassword(elm.value);
      var characterMessageElm = formElm.getElementsByClassName('password-req')[0];

      if(!validationPassed) {
        if(elm.value.length === 0) {
          message = 'This field is required';
        } else {
          message = 'Password is Invalid';
        }
        characterMessageElm.classList.add('error-show');
      } else if (validationPassed && characterMessageElm.classList.contains('error-show')) {
        characterMessageElm.className = characterMessageElm.classList.remove('error-show');
      }

      if(message) {
        formElm.getElementsByClassName('password1-related')[0].innerHTML = message;
      }

      return validationPassed;
    },
    password2: function(elm) {
      var message;
      var formElm = document.getElementById('signup-dialog');
      var password1 = formElm.querySelector('[name="password1"]');
      if(elm.value.length === 0) {
        message = 'This field is required';
      } else if (elm.value !== password1.value) {
        message = 'Please enter the same value again';
      }

      if(message) {
        formElm.getElementsByClassName('password2-related')[0].innerHTML = message;
      }
      
      return elm.value === password1.value && w.optly.mrkt.utils.checkComplexPassword(password1.value);
    }
  },
}).on('before', function() {
  var formElm = document.getElementById('signup-dialog');
  //set the hidden input value
  formElm.querySelector('[name="hidden"]').value = 'touched';
  return true;
}).on('validationerror', function(elm){
  var body = document.body;

  if( !body.classList.contains('error-state') ) {
    body.classList.add('error-state');
  }

  w.optly.mrkt.Oform.validationError(elm);
  
}).on('load', function(e){
  var body = document.body;

  if( body.classList.contains('error-state') ) {
    body.classList.remove('error-state');
  }

  var resp = JSON.parse(e.target.response);
  //get resonse info here and log to segment
  var source = w.optly.mrkt.source;
  w.analytics.identify(resp.email,{
    email: resp.email,
    name: resp.first_name + ' ' + resp.last_name,
    phone: resp.phone,
    token: resp.csrf_token,
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
    w.location = 'https://www.optimizely.com/dashboard';
  }, 500);

}).on('done', w.optly.mrkt.Oform.done);

