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
var $dropdownElems = $('.js-dropdown');
$dropdownElems.click(function(event) {
  var $this = $(this);
  $this.toggleClass('active');
  $dropdownElems.not( $this ).removeClass( 'active' );
});

$('.js-filter-item').on('click', function(event) {
  $('body').toggleClass($.trim($(this).attr('data-filter')));
});
