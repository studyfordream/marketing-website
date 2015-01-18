function smoothScroll(e) {
  var scrlId = $(this).attr('href'),
    targetElmPos = $(scrlId).offset().top;

  e.preventDefault();

  $('html,body').animate({
    scrollTop: targetElmPos
  }, 1000);

}

/*
* Video Player
*
*/
var player;
$(function() {

  //video player open and autoplay
  $('[data-show-video]').on('click', function(e) {
    e.preventDefault();
    fn_vidyard_Bf0qpT872TFpgGnJUqm0kA();
  });

  //listen for smooth scrolling
  $('[smooth-scroll]').on('click', smoothScroll);
});
