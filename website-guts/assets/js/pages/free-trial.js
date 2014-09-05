$('#seo-form').oForm({

  afterLocal: window.optly.mrkt.oForm.ppcFormDefaultResponseHandler

});

var settings,
    showIncrementValues,
    addCommas;

addCommas = function(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

settings = {
  // Update these values to update the predicted values
  visitorsBase: 2630536305, // visitor's starting point (how many visitors we got until today)
  visitors30days: 244397647, // visitors in the last 30 days
  experimentsBase: 223945,  // experiments' starting point
  experiments30days: 22602, // experiments in the last 30 days
  // Date(year, month, day) - Remember! month: 0 => Jan; 1 => Feb
  initialDate: new Date(2013, 5, 3) // Date when stats were taken
};
$.extend(settings, {
  visitorsRate: settings.visitors30days / 2592e+6, // visitors per second - 2592e+6 = number of seconds in 30 days
  experimentsRate: settings.experiments30days / 2592e+6
});

showIncrementValues = function() {
  var now = new Date();
  // Base number + predicted number
  // Predicted number = growth rate * diff of time since the base number was updated
  $('#visitors-tested-number').text( addCommas(Math.floor(settings.visitorsBase + settings.visitorsRate * (now - settings.initialDate))) );
  $('#experiments-run-number').text( addCommas(Math.floor(settings.experimentsBase + settings.experimentsRate * (now - settings.initialDate))) );
  // We use an interval instead of timeout in order to have some jitter
  var interval = Math.floor((Math.random() * 1800) + 600);
  setTimeout(showIncrementValues.bind(), interval);
};

showIncrementValues();
