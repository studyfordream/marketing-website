function smoothScroll(e) {
  var scrlId = $(this).attr('href'), 
    targetElmPos = $(scrlId).offset().top;

  e.preventDefault();

  $('html,body').animate({
    scrollTop: targetElmPos
  }, 1000);

}

var imgArr = [
  'http://www.invisionapp.com/assets/img/home/animations/prototyping-mockup-mobile.gif?r=1415238379934',
 'http://www.invisionapp.com/assets/img/home/animations/prototyping-mockup-realtime.gif?r=1415238473568',
 'http://www.invisionapp.com/assets/img/home/animations/prototyping-mockup-feedback.gif?r=1415238504566',
 'http://www.invisionapp.com/assets/img/home/animations/prototyping-mockup-manage.gif?r=1415238530321',
 'http://www.invisionapp.com/assets/img/home/animations/prototyping-mockup-sourcecontrol.gif?r=1415238571058'
];

//preload GIF's
for(var i = 0; i < imgArr.length; i+=1) {
  var img = new Image();
  img.src= imgArr[i];
}

function toggleSrc(tracker, scrollingDown, panelHidden) {
  if(!tracker.playing && scrollingDown && !panelHidden) {
    var savedSrc = tracker.elm.src;
    tracker.elm.src = savedSrc;
    tracker.playing = true;
    setTimeout(function() {
      tracker.playing = false;
    }, 5000);
  }
}

function initiateScrollListener(imgCache) {
  var lastWindowPos = 0;
  $(window).on('load scroll', function() {
    var windowBottom = $(window).scrollTop() + window.innerHeight;
    var scrollingDown = windowBottom > lastWindowPos;
    $.each(imgCache, function(i, tracker) {
      var $parentPanel = $(tracker.elm).closest('.panel');
      var parentTop = $parentPanel.offset().top;
      var parentBottom = $parentPanel.outerHeight() + parentTop;
      var panelHidden = parentBottom < $(window).scrollTop() || parentTop > windowBottom;
      
      if(windowBottom >= $(tracker.elm).offset().top) {
        toggleSrc(tracker, scrollingDown, panelHidden);
      }
      
    });
    lastWindowPos = windowBottom;
  });
}

$(function() {
  //listen for smooth scrolling
  $('[smooth-scroll]').on('click', smoothScroll);

  //deal with placeholder icons
  $('.panel input').on('focusout', function() {
    if(this.value.length !== 0) {
      this.classList.add('has-input-val');
    } else {
      this.classList.remove('has-input-val');
    }
  });

  //inject GIF src when they are scrolled into
  var imgCache = [];
  var $images = $('[data-interactive-panel] img');

  $.each($images, function(i, elm) {
    var elmCache = {};
    elmCache.elm = elm;
    elmCache.playing = false;
    elm.src = imgArr[i];
    imgCache.push(elmCache);
  });

  initiateScrollListener(imgCache);

  $images.on('click mouseover', function() {
    var imgIndex = this.dataset.imgIndex;
    toggleSrc(imgCache[imgIndex], true, false);
  });

});
