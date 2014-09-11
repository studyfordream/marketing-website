$(function(){
  var currentIndex = 0;
  var $slides = $('[data-slides]');

  $('[data-slider-nav]').on('click', function() {
    var enterIndex;
    var animInProgress;
    var direction = $(this).data('slider-nav');

    $slides.each(function(i, elm) {
      if( $(elm).hasClass('anim-enter') || $(elm).hasClass('anim-leave') ) {
        animInProgress = true;
      }
    });

    if(direction === 'right') {
      if(currentIndex === $slides.length - 1) {
        enterIndex = 0;
      } else {
        enterIndex = currentIndex + 1;
      }
    } else if (direction === 'left') {
      if(currentIndex === 0) {
        enterIndex = $slides.length - 1;
      } else {
        enterIndex = currentIndex - 1;
      }
    }

    var $enterElm = $('[data-slides="' + enterIndex + '"]');
    var $exitElm = $('[data-slides="' + currentIndex + '"]');

    if(!animInProgress) {
      window.optly.mrkt.anim.enter($enterElm, direction);
      window.optly.mrkt.anim.leave($exitElm, direction);

      currentIndex = enterIndex;
    }
  });
});
