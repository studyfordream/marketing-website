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

    w.analytics.track(w.location.pathname, {

      category: 'form error',

      label: element.getAttribute('name')

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
        source;

    source = w.optly.mrkt.source;

    reportingObject = {

      token: JSON.parse(XMLHttpRequest.target.responseText) || '',
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
      Signup_Platform__c: source.signupPlatform

    };

    for(propertyName in data){

      reportingObject['propertyName'] = data['propertyName']; //jshint ignore:line

    }

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
    w.analytics.track('/account/signin', {
      category: 'account',
      lable: w.location.pathname
    }, {
      Marketo: true
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
