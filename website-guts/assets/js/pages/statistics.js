function smoothScroll(e) {
  var scrlId = $(this).attr('href'),
    targetElmPos = $(scrlId).offset().top;

  e.preventDefault();

  $('html,body').animate({
    scrollTop: targetElmPos
  }, 1000);

}

$(function() {
  //listen for smooth scrolling
  $('[smooth-scroll]').on('click', smoothScroll);
});
