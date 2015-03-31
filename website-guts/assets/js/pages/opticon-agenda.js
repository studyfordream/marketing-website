//Accordian for talks

$('.js-toggle-cont').slideToggle('fast'); //all details closed to start

$('.js-accordian-control').click(function(event) {
  event.preventDefault();
  //TODO Find correct selector for this line
  $(this).next().toggleClass('expansion-arrow--open');
  $(this).next().next().slideToggle('fast');
});
$('.js-arrow').click(function(event) {
  $(this).toggleClass('expansion-arrow--open');
  $(this).next().slideToggle('fast');
});

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
    $dayOne = $('#day-one-header'),
    $dayTwo = $('#day-two-header'),
    $window = $(window);
$window.on('scroll', function(e) {
  var scrollTop = $window.scrollTop();
  console.log(scrollTop);
  if (scrollTop < 200) {
    $filterRow.removeClass('fixed-filter');
    $dayOne.removeClass('up-arrow');
    $dayOne.addClass('agenda-day--active');
  } else if (scrollTop >= 200) {
    $filterRow.addClass('fixed-filter');
    if (scrollTop < 2890) { // activate day one
      $dayOne.addClass('agenda-day--active up-arrow');
      $dayTwo.removeClass('agenda-day--active up-arrow');
    } else if (scrollTop >= 2890) { // activate day two
      $dayTwo.addClass('agenda-day--active');
      $dayOne.removeClass('agenda-day--active up-arrow');
      if (scrollTop >= 2980) {
        $dayTwo.addClass('up-arrow');
      }
    }
  }
});

/*
  If item is in array, remove it
  else, add it
*/
function toggleArrayItem(array, item) {
  var itemIndex = $.inArray(item, array);
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
    $events = $('.js-event'),
    filterList = [],
    $filterListItem = $('.js-filter-item'),
    $eventsContainers = $('.js-events');

//Top filter dropdown
$dropdownElems.click(function(event) {
  var $this = $(this);
  $this.toggleClass('active');
  $dropdownElems.not( $this ).removeClass( 'active' );
  $this.mouseleave(function(){
    $this.removeClass( 'active' );
  });
});

//Filter logic
$filterListItem.on('click', function(event) {
  event.stopPropagation();
  var $this = $(this),
      selectedData = ($.trim($this.attr('data-filter')));

  toggleArrayItem(filterList, selectedData);
  $this.toggleClass('selected');

  //$('#ham').children().each(function(index, item) { if($(item).css('display') !== 'none') {$(item).css('margin-top', 0) } })
  if(filterList) {
    $events.each(function(eventIndex, eventItem) {
      // array of tracks and roles for each event
      var eventFilterList = ($(eventItem).data('track') + ' ' + $(eventItem).data('roles')).split(' ');
      // if every item in filterlist isn't present on the event, hide it
      if(!isSubset(filterList, eventFilterList)) {
        $(eventItem).hide();
      } else {
        $(eventItem).show();
      }
    });
  }
  // The first child of each time slot shouldn't have margin-top
  $eventsContainers.each(function(index, eventContainer) {
    $(eventContainer).children().each(function(index, event) {
      var $event = $(event);
      if ($event.css('display') !== 'none') {
        $event.css('margin-top', 0);
        return;
      }
    });
  });
});

// Reset -- clear all filters
$('.js-reset').on('click', function(event) {
  filterList = [];
  $events.each(function(eIndex, eventItem) {
    $(eventItem).show();
  });
  $filterListItem.each(function(eIndex, eventItem) {
    $(this).removeClass('selected');
  });
});
