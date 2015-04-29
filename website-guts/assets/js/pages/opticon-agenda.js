var $dayTwo = $('#day-two');
var dayTwoDistanceFromTop = $dayTwo.offset().top,
    $window = $(window),
    $events = $('.js-event');

/*
   Recalculate the distance from the top
   in order to highlight the Days Nav
*/
function calculateDayTwoDistanceFromTop() {
  dayTwoDistanceFromTop = $dayTwo.offset().top - $window.scrollTop();
}

//Accordian for talks
$('.js-toggle-cont').slideToggle('fast'); //all details closed to start
$('.js-accordian-control').click(function() {
  $(this).nextAll('.js-arrow').toggleClass('expansion-arrow--open');
  $(this).nextAll('.js-toggle-cont').slideToggle('fast', calculateDayTwoDistanceFromTop);
});
$('.js-arrow').click(function() {
  $(this).toggleClass('expansion-arrow--open');
  $(this).nextAll('.js-toggle-cont').slideToggle('fast', calculateDayTwoDistanceFromTop);
});

// Expand all
$('.js-expand-all').click(function() {
  $events.each(function(index, item) {
    $(item).find('.js-arrow').addClass('expansion-arrow--open');
    $(item).find('.js-toggle-cont').show('fast', calculateDayTwoDistanceFromTop);
  });
});

// Override smoothScroll to subtrack 180
// TODO: modify smoothscroll to accept optional argument
w.optly.mrkt.utils.smoothScroll = function(event) {
	var targetElmPos = $(this.getAttribute('href')).offset().top - 180;
	event.preventDefault();
	$('html,body').animate({
		scrollTop: targetElmPos
	}, 1000);
};

//Smoothscroll for Days
$('#day-one-link').on('click', w.optly.mrkt.utils.smoothScroll);
$('#day-two-link').on('click', w.optly.mrkt.utils.smoothScroll);

//Scroll logic for day selection
var $filterRow = $('#filter-row'),
    $dayOneNav = $('#day-one-header'),
    $dayTwoNav = $('#day-two-header');
$window.on('scroll', function() {
  var scrollTop = $window.scrollTop();
  calculateDayTwoDistanceFromTop();
  if (scrollTop < 200) {
    $filterRow.removeClass('fixed-filter');
    $dayOneNav.removeClass('up-arrow');
    $dayOneNav.addClass('agenda-day--active');
  } else if (scrollTop >= 200) {
    $filterRow.addClass('fixed-filter');
    if (dayTwoDistanceFromTop >= 150) { // activate day one
      $dayOneNav.addClass('agenda-day--active up-arrow');
      $dayTwoNav.removeClass('agenda-day--active up-arrow');
    } else if (dayTwoDistanceFromTop < 150) { // activate day two
      $dayTwoNav.addClass('agenda-day--active');
      $dayOneNav.removeClass('agenda-day--active up-arrow');
      if (dayTwoDistanceFromTop < 25) {
        $dayTwoNav.addClass('up-arrow');
      }
    }
  }
});

/*
  If item is in array, remove it
  else, add it
*/
function toggleArrayItem(array, item) {
  var itemIndex = array.indexOf(item);
  if(itemIndex !== -1) {
    array.splice(itemIndex,1);
  } else {
    array.push(item);
  }
}

/*
  Check that every item in arr1
  is in arr2 i.e. arr1 is subset
  of arr2
*/
function isSubset(arr1, arr2) {
  return arr1.every(function(val) {
    return arr2.indexOf(val) >= 0;
  });
}

var $dropdownElems = $('.js-dropdown'),
    filterList = [],
    $filterListItem = $('.js-filter-item'),
    $eventsContainers = $('.js-events');

//Top filter dropdown
$dropdownElems.click(function() {
  var $this = $(this);
  $this.toggleClass('active');
  $dropdownElems.not( $this ).removeClass( 'active' );
  $this.one('mouseleave', function(){
    $this.removeClass( 'active' );
  });
});

/*
  The first child of each time slot shouldn't have margin-top
  but every following item should
*/
function changeTalkVisibility() {
  $eventsContainers.each(function(index, eventContainer) {
    var visibleTalks = $(eventContainer).children()
    .filter(function(index, item) {
      return $(item).css('display') !== 'none';
    });

    // If no talks match filter criteria,
    // hide the time slot
    if (visibleTalks.length === 0) {
      $(this).parent().hide();
    } else {
      $(this).parent().show();
    }

    visibleTalks.each(function(index, visibleTalk) {
      if (index === 0) {
        visibleTalk.style.marginTop = 0;
      } else {
        visibleTalk.style.marginTop = '50px';
      }
    });
  });
  calculateDayTwoDistanceFromTop();
}

//Filter logic
$filterListItem.on('click', function(event) {
  event.stopPropagation();
  var $this = $(this),
      selectedData = ($.trim($this.attr('data-filter')));

  toggleArrayItem(filterList, selectedData);
  $this.toggleClass('selected');

  if(filterList) {
    $events.each(function(eventIndex, eventItem) {
      // array of tracks and roles for each event
      var eventFilterList = ($(eventItem).data('track') + ' ' + $(eventItem).data('roles')).split(' ');
      // if every item in filterlist isn't present on the event, hide it
      if(!isSubset(filterList, eventFilterList)) {
        $(eventItem).hide(200, changeTalkVisibility);
      } else {
        $(eventItem).show(200, changeTalkVisibility);
      }
    });
  }
});

// Reset -- clear all filters
$('.js-reset').on('click', function() {
  filterList = [];
  $events.each(function(eIndex, eventItem) {
    console.log(eIndex);
    $(eventItem).show(200, changeTalkVisibility);
  });
  $filterListItem.each(function() {
    $(this).removeClass('selected');
  });
});
