var moment = require('../utils/client-moment');
var webinarEventDisplay = require('webinarEventDisplay');
var webinarEventDetail = require('webinarEventDetail');
var eventDisplayHTML, templateContext, dateArray, i;

window.optly = window.optly || {};
window.optly.mrkt = window.optly.mrkt || {};
window.optly.mrkt.webinar = window.optly.mrkt.webinar || {};


window.optly.mrkt.webinar.getThursdays = function() {

  var numDates,
      today,
      webinarDay,
      webinarHour,
      webinarMinute,
      webinarDayAndTimeInSeconds,
      todayInSeconds,
      dates,
      secondsUntilNextWebinar,
      daysToSeconds,
      hoursToSeconds,
      minutesToSeconds,
      i;

  numDates = 3;
  today = new Date();
  webinarDay = 4; // Thursday
  webinarHour = 11; // 11 am
  webinarMinute = 15; // 15 minutes past the hour

  daysToSeconds = function(days){
    return days * 24 * 60 * 60;
  };
  hoursToSeconds = function(hours){
    return hours * 60 * 60;
  };
  minutesToSeconds = function(minutes){
    return minutes * 60;
  };

  webinarDayAndTimeInSeconds = daysToSeconds(webinarDay) + hoursToSeconds(webinarHour) + minutesToSeconds(webinarMinute);
  todayInSeconds = daysToSeconds(today.getDay()) + hoursToSeconds(today.getHours()) + minutesToSeconds(today.getMinutes());
  dates = new Array(numDates);
  secondsUntilNextWebinar = todayInSeconds - webinarDayAndTimeInSeconds;

  if(secondsUntilNextWebinar >= 0){
    secondsUntilNextWebinar = daysToSeconds(7) - secondsUntilNextWebinar;
  } else {
    secondsUntilNextWebinar = -secondsUntilNextWebinar;
  }

  for (i = numDates - 1; i >= 0; i--) {
    dates[i] = new Date(today.getTime() + (secondsUntilNextWebinar + daysToSeconds(i * 7)) * 1000);
  }

  return dates;

};

templateContext = {};

templateContext.thursdays = [];

dateArray = window.optly.mrkt.webinar.getThursdays();

for(i = 0; i < dateArray.length; i++){
  var container, date;
  container = {};
  date = moment(dateArray[i]);
  container.index = i;
  container.month = date.format('MMMM');
  container.day = date.format('D');
  container.dateLong = date.format('M-D-YYYY');
  container.calDate = date.format('YYYYMMDD');
  container.linkPath = window.linkPath;
  templateContext.thursdays.push(container);
}

$(function(){

  eventDisplayHTML = webinarEventDisplay(templateContext);

  $('#events').html(eventDisplayHTML);

  new Oform({
    selector: '#webinar-registration-form',
    middleware: w.optly.mrkt.Oform.defaultMiddleware
  }).on('before', function(){
    var name = $('#name').val().split(' ');
    $('[name="FirstName"]').val( name[0] );
    $('[name="LastName"]').val( name[1] );
    return true;
  }).on('load', function(event){
    if(event.XHR.status === 200){
      w.optly.mrkt.modal.close({
        modalType: 'webinar-signup',
        track: false
      });
      w.optly.mrkt.modal.open({modalType: 'webinar-confirmation'});
    }
    window.analytics.track('webinar signup', {
      category: 'webinar',
      label: w.location.pathname
    }, {
      Marketo: true
    });
  }).on('validationerror', w.optly.mrkt.Oform.validationError);

  $('body').delegate('.register-btn', 'click', function(e){

    e.preventDefault();

    var index, elem;

    elem = $(this);

    index = parseInt( elem.attr('data-index') );

    $('[name="WebinarRegistrationDate"]').val( $(this).attr('data-date-long') );

    $('.webinar-detail-info').each(function(){

      $(this).html( webinarEventDetail(templateContext.thursdays[index]) );

    });

    window.optly.mrkt.modal.open({ modalType: 'webinar-signup' });

  });

});
