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
    window.optly.mrkt.modal.open({modalType: 'video-modal'});
    $('.fallback-player').addClass('show-fallback');
    $('.fallback-player').attr('src', '//play.vidyard.com/Bf0qpT872TFpgGnJUqm0kA.html?v=3.1');
  });

  $('[data-optly-modal="video-modal"]').on('click', function(e) {
    $('.fallback-player').attr('src', '');
  });

  //listen for smooth scrolling
  $('[smooth-scroll]').on('click', smoothScroll);
});
