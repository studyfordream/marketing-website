window.optly.mrkt.anim= window.optly.mrkt.anim || {};

//apply active class to active links
w.optly.mrkt.activeLinks = {};

w.optly.mrkt.activeLinks.currentPath = w.location.pathname;

w.optly.mrkt.activeLinks.markActiveLinks = function(){

  $('a').each(function(){

    var href = $(this).attr('href');

    if(href  === w.optly.mrkt.activeLinks.currentPath || href + '/' === w.optly.mrkt.activeLinks.currentPath) {

      $(this).addClass('active');

    }

  });

};

w.optly.mrkt.activeLinks.markActiveLinks();

w.optly.mrkt.inlineFormLabels = function(){

  if(w.optly.mrkt.browser !== 'Explorer'){

    $('form.inline-labels :input').each(function(index, elem) {

      var eId = $(elem).attr('id');

      var label = null;

      if (eId && (label = $(elem).parents('form').find('label[for='+eId+']')).length === 1) {

        $(elem).attr('placeholder', $(label).html());

        $(label).addClass('hide-label');

      }

    });

  }

};

w.optly.mrkt.formDataStringToObject = function getJsonFromUrl(string) {

  var data, result, i;

  data = string.split('&');

  result = {};

  for(i=0; i<data.length; i++) {

    var item = data[i].split('=');

    result[item[0]] = item[1];

  }

  return result;

};

/*  Random string function for analytics.identify
 * taken from here:
 * http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
 */
w.optly.mrkt.utils.randomString = function() {

  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for(var i=0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

/**
 * If the visitor has account data send data to Marketo on page load
 * TODO: Can this be deprecated, seems as if it's contributing to Marketo queue issues
 */
w.optly_q.push([function(){

  if(typeof w.optly_q.acctData === 'object'){

    w.analytics.ready(function(){

      w.Munchkin.munchkinFunction('associateLead', {

        Email: w.optly_q.acctData.email

      }, w.optly_q.acctData.munchkin_token);

    });

    var anonymousVisitorIdentifier = w.optly.mrkt.utils.randomString();
    w.analytics.identify(anonymousVisitorIdentifier, {
      name: w.optly_q.acctData.name,
      email: w.optly_q.acctData.email,
      Email: w.optly_q.acctData.email
    });

  }

}]);

//pre-populate fields from account info
w.optly_q.push([function(){
  if(typeof w.optly.mrkt.user.acctData === 'object'){
    if(typeof w.optly.mrkt.user.acctData.first_name === 'string'){
      $('[name="first_name"]').val(w.optly.mrkt.user.acctData.first_name);
    }
    if(typeof w.optly.mrkt.user.acctData.last_name === 'string'){
      $('[name="last_name"]').val(w.optly.mrkt.user.acctData.last_name);
    }
    if(
      typeof w.optly.mrkt.user.acctData.first_name === 'string' &&
        typeof w.optly.mrkt.user.acctData.last_name === 'string'
    ){
      $('[name="name"]').val(w.optly.mrkt.user.acctData.first_name + ' ' + w.optly.mrkt.user.acctData.last_name);
    }
    if(typeof w.optly.mrkt.user.acctData.email === 'string'){
      $('[name="email"]').val(w.optly.mrkt.user.acctData.email);
      $('[name="email_address"]').val(w.optly.mrkt.user.acctData.email);
    }
  }
}]);

w.optly.mrkt.formHadError = false;

w.optly.mrkt.deleteCookie = function(name, options) {
  $.removeCookie(name, options);
};

//call the utility function to unregister archived experiments from the mixpanel cookie
w.analytics.ready(w.optly.mrkt.utils.trimMixpanelCookie);

//report optimizely load time
if(w.monitorTiming){
  var reportOptimizelyTiming = setInterval(function(){
    if(w.optimizelyLoadTime){
      if(w.ga){
        w.ga('send', {
          'hitType': 'timing',
          'timingCategory': 'external script timing',
          'timingVar': 'cdn.optimizely.com',
          'timingValue': w.optimizelyLoadTime,
          'timingLabel': 'Optimizely',
          'page': w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
        });
        clearInterval(reportOptimizelyTiming);
      }
    }
  }, 1000);
}

if( $.cookie('amplitude_idoptimizely.com') ) {
  w.optly.mrkt.deleteCookie('amplitude_idoptimizely.com', { path: '/', expires: -5, domain: '.optimizely.com'} );
}

w.optly.mrkt.setAttributeCookie = function(signInResponse){

  var setCookieValue = function(args){

    var userAtrributeValues = [],
    planMap = w.optly.planMap,
    planCode,
    plan;

    if(typeof args === 'object'){

      //the first value is the user's plan
      if(typeof args.plan === 'string'){

        plan = args.plan;

        //see if the value for plan is an actual plan in the planMap
        if(typeof planMap[plan] === 'string'){

          planCode = planMap[plan];

        }

      }

      userAtrributeValues.push(planCode);

      //set the cookie values
      $.cookie('visitorAttributes', userAtrributeValues.join('|'), {expires: 90, path: '/'});

    }

  };

  if(typeof signInResponse === 'object'){

    //get user information from the sign in response
    if(typeof signInResponse.plan_id === 'string'){

      setCookieValue({plan: signInResponse.plan_id});

    }

  } else {

    //try get the plan from the user's account info if they are signed in
    if(
      typeof w.optly.mrkt.user === 'object' &&
        typeof w.optly.mrkt.user.acctData === 'object'
    ){

      if(typeof w.optly.mrkt.user.acctData.plan_id === 'string'){

        setCookieValue({plan: w.optly.mrkt.user.acctData.plan_id});

      }

    }

  }

};

w.optly_q.push([w.optly.mrkt.setAttributeCookie]);

$(function() {
  $(window).scrollTop(0);
});
