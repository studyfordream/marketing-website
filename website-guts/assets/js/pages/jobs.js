window.optly.mrkt.jobsPage = {};

window.optly.mrkt.jobsPage.testimonials = function() {
    var lastIndex = 0;
    var $quotes = $('h4.quotes q');
    var $icons = $('.employee-icons li');

    $icons.on('click', function(e){
        e.preventDefault();
        var index = $(this).index();

        if(index !== lastIndex) {
            $( $quotes[index] ).removeClass('hide');
            $(this).removeClass('opaque');

            $( $quotes[lastIndex] ).addClass('hide');
            $( $icons[lastIndex] ).addClass('opaque');

            lastIndex = index;
        }
    });
};

$('#view-all-jobs').click(function() {
    $('html, body').animate({scrollTop: $('#jobs-list').offset().top}, 700);
    return false;
});

window.optly.mrkt.jobsPage.testimonials();

function getGreenhouseData(data) {
      if(typeof data === 'object'){

        for(var i = 0; i < data.departments.length; i++){
          if(data.departments[i].jobs.length === 0){
            delete data.departments[i];
          }
        }
        
        $('#job-list-cont').append( window.optly.mrkt.templates.jobList(data) );
      }
}

var deferred = $.getJSON('https://api.greenhouse.io/v1/boards/optimizely7/embed/departments?callback=?');

deferred.then(getGreenhouseData, function(err) {
    window.analytics.track(window.location.pathname, {
      category: 'api error',
      label: err.responseText + ', Response Code: ' + err.status,
    });
});
