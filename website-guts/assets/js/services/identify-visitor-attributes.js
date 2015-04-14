window.optly.identifyVisitorAttributes = function(){
  window.optly.planMap = {
    'free':               '1',
    'free_light': 				'1',
    'bronze-monthly': 		'2',
    'bronze-oneyear': 		'2',
    'bronze-twoyear': 		'2',
    'silver-monthly': 		'3',
    'silver-oneyear': 		'3',
    'silver-twoyear': 		'3',
    'gold-monthly': 			'4',
    'gold-oneyear': 			'4',
    'gold-twoyear': 			'4',
    'enterprise-monthly': '5',
    'enterprise-oneyear': '5',
    'enterprise-twoyear': '5',
    '1':                  'free',
    '2':                  'bronze',
    '3':                  'silver',
    '4':                  'gold',
    '5':                  'enterprise'
  };
  window.optly.visitorAttributes = $.cookie('visitorAttributes');
  if($.cookie('optimizely_signed_in')){
    window.optly.signedIn = true;
  } else {
    window.optly.signedIn = false;
  }
  var plan;
  if(window.optly.visitorAttributes){
    window.optly.visitorAttributes = window.optly.visitorAttributes.split('|');
    if(typeof window.optly.planMap[window.optly.visitorAttributes[0]] === 'string'){
      plan = window.optly.planMap[window.optly.visitorAttributes[0]];
    } else {
      plan = 'none';
    }
  } else {
    plan = 'none';
  }
  $(function(){
    $('body').attr('data-plan', plan);
  });
  window.analytics.ready(function() {
    window.analytics.identify({
      'Customer plan': plan,
      'Signed in': window.optly.signedIn
    });
  });
};

window.optly.identifyVisitorAttributes();

