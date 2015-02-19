window.optly.mrkt.utils.trimMixpanelCookie = function trimMixpanelCookie(){
  //method to check for and unregister any archived experiments previously registered as super properties.
  //First, get a list of all active and paused experiments (should not include archived or deleted experiments)
  var allExperiments = window['optimizely'].data.experiments,
    allExperimentNames = [],
    cookieIsDefined;

  $.each(allExperiments, function(id, exp) {
    allExperimentNames.push(exp.name);
  });

  //Next, check the Mixpanel cookie for any Experiment super properties not in the list of active and paused experiments and unregister them if found
  if(typeof window.mixpanel === 'object' && window.mixpanel !== undefined) {
    cookieIsDefined = typeof (window.mixpanel.cookie && window.mixpanel.cookie.props) === 'object';

    //iterate over mixpanel cookie props object
    if(cookieIsDefined) {
      $.each(window.mixpanel.cookie.props, function(propKey, prop) {
        var propStr;
        if ( /Experiment\:/.test( propKey ) ) {
          propStr = propKey.substr( propKey.indexOf(':')  + 1 );

          if ( allExperimentNames.indexOf( propStr ) === -1) {
            mixpanel.unregister(propKey);
          }
        }
      });
    }
  }

};

