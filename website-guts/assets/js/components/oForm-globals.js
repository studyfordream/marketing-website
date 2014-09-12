(function(){

  var w, d;

  w = window;

  d = document;

  w.optly = w.optly || {};

  w.optly.mrkt = w.optly.mrkt || {};

  w.optly.mrkt.Oform = {};

  w.optly.mrkt.Oform.before = function(){

    d.getElementsByTagName('body')[0].classList.add('processing');

    return true;

  };

  w.optly.mrkt.Oform.validationError = function(element){

    w.analytics.track(w.location.pathname, {

      category: 'form error',

      label: element.getAttribute('name')

    });

  };

  w.optly.mrkt.Oform.done = function(){

    d.getElementsByTagName('body')[0].classList.remove('processing');

  };

})();
