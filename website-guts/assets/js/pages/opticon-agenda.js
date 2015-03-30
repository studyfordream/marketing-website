//Accordian for talks
var $accordianControls = $('.js-accordian-control');
$('.js-toggle-cont').slideToggle('fast'); //all details closed to start
$accordianControls.click(function(event) {
  event.preventDefault();
  //TODO Find correct selector for this line
  $(this).next().toggleClass('expansion-arrow--open');
  $(this).next().next().slideToggle('fast');
});
$('.js-arrow').click(function(event) {
  $(this).toggleClass('expansion-arrow--open');
  $(this).next().slideToggle('fast');
});


//Top Filter
var $dropdownElems = $('.js-dropdown'),
    $events = $('.js-event'),
    filterList = [];

/* If item is in array, remove it
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

/* Check that every item in arr1
   is in arr2 i.e. arr1 is subset
   of arr2
*/
function isSubset(arr1, arr2) {
  return arr1.every(function(val) {
    return arr2.indexOf(val) >= 0;
  });
}

//Top filter dropdown
$dropdownElems.click(function(event) {
  var $this = $(this);
  $this.toggleClass('active');
  $dropdownElems.not( $this ).removeClass( 'active' );
});

//Filter logic
$('.js-filter-item').on('click', function(event) {
  var selectedData = ($.trim($(this).attr('data-filter')));
  toggleArrayItem(filterList, selectedData);
  $(this).toggleClass('selected');

  if(filterList) {
    $events.each(function(eIndex, eItem) {
      var eventFilterList = ($(eItem).data('track') + ' ' + $(eItem).data('roles')).split(' ');
      if(! isSubset(filterList, eventFilterList)) {
        $(eItem).hide();
      } else {
        $(eItem).show();
      }
    });
  }
});

// Reset -- clear all filters
$('.js-reset').on('click', function(event) {
  filterList = [];
  $events.each(function(eIndex, eItem) {
    $(eItem).show();
  });
});
