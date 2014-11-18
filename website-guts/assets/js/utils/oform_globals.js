;(function(){

  var w, d;

  w = window;

  d = document;

  w.optly = w.optly || {};

  w.optly.mrkt = w.optly.mrkt || {};

  w.optly.mrkt.Oform = {};

  w.optly.mrkt.Oform.before = function(){

    d.getElementsByTagName('body')[0].classList.add('oform-processing');

    return true;

  };

  w.optly.mrkt.Oform.validationError = function(element){

    var elementValue = $(element).val();

    var elementHasValue = elementValue ? 'has value' : 'no value';

    w.analytics.track($(element).closest('form').attr('id') + ' ' + element.getAttribute('name') + ' error', {

      category: 'form error',

      label: elementHasValue,

      value: elementValue.length

    }, {

      Marketo: true

    });

  };

  w.optly.mrkt.Oform.done = function(){

    d.getElementsByTagName('body')[0].classList.remove('processing');

  };

  w.optly.mrkt.Oform.trackLead = function(data, XMLHttpRequest){

    var propertyName,
        reportingObject,
        source,
        response,
        token;

    source = w.optly.mrkt.source;

    response = JSON.parse(XMLHttpRequest.target.responseText);

    if(response.token){

      token = response.token;

    } else if(response.munchkin_token){

      token = response.munchkin_token;

    } else {

      token = '';

    }

    reportingObject = {

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
      GCLID__c: source.gclid,
      Signup_Platform__c: source.signupPlatform,
      Email: response.email,
      FirstName: response.first_name,
      LastName: response.last_name,
      Phone: response.phone_number,
      web__c: $('input[type="checkbox"][name="web"]').is(':checked') + '',
      mobile_web__c: $('input[type="checkbox"][name="mobile_web"]').is(':checked') + '',
      ios__c: $('input[type="checkbox"][name="ios"]').is(':checked') + '',
      android__c: $('input[type="checkbox"][name="android"]').is(':checked') + ''

    };

    $.cookie('sourceCookie',
      source.utm.campaign + '|||' +
      source.utm.content + '|||' +
      source.utm.medium + '|||' +
      source.utm.source + '|||' +
      source.utm.keyword + '|||' +
      source.otm.campaign + '|||' +
      source.otm.content + '|||' +
      source.otm.medium + '|||' +
      source.otm.source + '|||' +
      source.otm.keyword + '|||' +
      source.signupPlatform + '|||'
    );

    for(propertyName in data){

      reportingObject[propertyName] = data[propertyName]; //jshint ignore:line

    }

    if(window.debug){
      window.debugger;
    }

    w.Munchkin.munchkinFunction('associateLead', reportingObject, token);

    w.analytics.identify(data.email, reportingObject, {
      integrations: {
        Marketo: true
      }
    });

    /* legacy reporting - to be deprecated */

    w.analytics.track('/account/create/success', {
      category: 'account',
      label: w.location.pathname
    }, {
      Marketo: true
    });

    w.Munchkin.munchkinFunction('visitWebPage', {
      url: '/account/create/success'
    });

    w.Munchkin.munchkinFunction('visitWebPage', {
      url: '/event/account/create/success'
    });

    w.analytics.track('/account/signin', {
      category: 'account',
      lable: w.location.pathname
    }, {
      Marketo: true
    });

    w.Munchkin.munchkinFunction('visitWebPage', {
      url: '/event/account/signin'
    });
    w.Munchkin.munchkinFunction('visitWebPage', {
      url: '/event/customer/signedin'
    });
    w.Munchkin.munchkinFunction('visitWebPage', {
      url: '/event/plan/' + plan
    });

    /* new reporting */

    w.analytics.track('account created', {
      category: 'account',
      label: w.location.pathname
    }, {
      Marketo: true
    });
    w.analytics.track('account signin', {
      category: 'account',
      lable: w.location.pathname
    }, {
      Marketo: true
    });

  };

  w.optly.mrkt.Oform.initContactForm = function(arg){

    new Oform({
      selector: arg.selector
    })
    .on('validationerror', w.optly.mrkt.Oform.validationError)
    .on('load', function(event){
      if(event.target.status === 200){
        //identify user
        $('body').addClass('oform-success');
        var response = JSON.parse(event.target.responseText),
            email = d.querySelector('[name="email"]').value,
            traffic = d.querySelector('#traffic');
        w.analytics.identify(email, {
          name: d.querySelector('[name="name"]').value,
          email: email,
          phone: d.querySelector('[name="phone"]').value || '',
          company: d.querySelector('[name="company"]').value || '',
          website: d.querySelector('[name="website"]').value || '',
          utm_Medium__c: window.optly.mrkt.source.utm.medium,
          otm_Medium__c: window.optly.mrkt.source.otm.medium,
          Demo_Request_Monthly_Traffic__c: traffic.options[traffic.selectedIndex].value || '',
          Inbound_Lead_Form_Type__c: d.querySelector('[name="inboundFormLeadType"]').value,
          token: response.token
        }, {
          integrations: {
            Marketo: true
          }
        });
        //track the event
        w.analytics.track('demo requested', {
          category: 'contact form',
          label: w.location.pathname
        }, {
          Marketo: true
        });
      }
    });

  };

})();
