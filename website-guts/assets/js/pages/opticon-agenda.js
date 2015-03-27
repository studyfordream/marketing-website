var accordianControl = $('.js-accordian-control');
$('.js-toggle-cont').slideToggle('fast'); //all details closed to start

$(accordianControl).click(function(event) {
  event.preventDefault();
  //TODO Find correct selector for this line
  $(this).next().toggleClass('expansion-arrow--open');
  $(this).next().next().slideToggle('fast');
});
