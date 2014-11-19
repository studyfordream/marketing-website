window.optly.mrkt.gettingStarted = {};

w.optly.mrkt.gettingStarted.testItOut = function(editURL){

  //send user to the editor
  w.location = 'https://www.optimizely.com/edit?url=' + encodeURIComponent(editURL);

  w.analytics.track('getting started test it out submitted', {
    category: 'forms',
    label: w.location.pathname
  });

};

$('#test-it-out input[type="text"]').focus();

$('#test-it-out').submit(function(e){
  e.preventDefault();

  var inputVal = $('#test-it-out input[type="text"]').val();
  if( inputVal ){
      w.optly.mrkt.gettingStarted.testItOut(inputVal);
  } else {
    $('input[type="text"]').focus();
  }
});
