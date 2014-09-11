


$(function(){
  var intId, lastDirection, setCarouselInv;
  var int = 4000;
  var currentIndex = 0;
  var $slides = $('[data-slides]');

  var animateCarousel = function(e) {
    var enterIndex;
    var animInProgress;
    var direction;
    if (e) {
      direction = $(this).data('slider-nav');
    } else {
      direction = lastDirection ? lastDirection : 'anim-right';    
    }

    $slides.each(function(i, elm) {
      if( !!$(elm).data('trans-class') ) {
        animInProgress = true;
      }
    });

    if(direction === 'anim-right') {
      if(currentIndex === $slides.length - 1) {
        enterIndex = 0;
      } else {
        enterIndex = currentIndex + 1;
      }
    } else if (direction === 'anim-left') {
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
      lastDirection = direction;
      window.clearTimeout(intId);
      intId = setCarouselInv();
    }
  };

  setCarouselInv = function() {
    return window.setTimeout(animateCarousel, int);
  };
  
  intId = setCarouselInv();

  $('[data-slider-nav]').on('click', animateCarousel);
});
