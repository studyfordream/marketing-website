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
var tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
var scriptTags = document.getElementsByTagName('script');
var lastScriptTag = scriptTags[scriptTags.length - 1];
lastScriptTag.parentNode.insertBefore(tag, lastScriptTag.nextSibling);

window.onYouTubeIframeAPIReady = function () {
  player = new window.YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'pjnHonrJykg'
  });
};


$(function() {
   var videoPlayed = false,
    playerSupported = false;

  //video player open and autoplay
  $('[data-show-video]').on('click', function(e) {
    e.preventDefault();
    window.optly.mrkt.modal.open({modalType: 'video-modal'});
    if(typeof player === 'object' && typeof player.getPlayerState === 'function') {
      playerSupported = true;
      //deal with the lack of autoplay upon inital open for mobile
      if(!window.optly.mrkt.isMobile() || videoPlayed) {
        var playerInt = window.setInterval(function() {
          if(player.getPlayerState() !== 1) {
            player.playVideo();
          } else {
            window.clearInterval(playerInt);
          }
        }, 10);
      }
    } else {
      if(!videoPlayed) {
        $('#player').css({display: 'none'});
        $('.fallback-player').addClass('show-fallback');
      }
      $('.fallback-player').attr('src', 'https://www.youtube.com/embed/pjnHonrJykg?autoplay=1');
    }
    if(!videoPlayed) {
      videoPlayed = true;
    }
  });

  $('[data-optly-modal="video-modal"]').on('click', function(e) {
    e.preventDefault();
    if(playerSupported) {
      player.stopVideo();
    } else {
      $('.fallback-player').attr('src', '');
    }
  });

  //listen for smooth scrolling
  $('[smooth-scroll]').on('click', smoothScroll);

  //deal with placeholder icons
  window.optly.mrkt.anim.placeholderIcons({inputs: $('.panel input')});

  //inject GIF src when they are scrolled into
  var imgCache = [];
  var $images = $('[data-interactive-panel] img');

  $.each($images, function(i, elm) {
    var elmCache = {};
    var dataSet = $(elm).data();
    elmCache.elm = elm;
    elmCache.index = dataSet.imgIndex;
    elmCache.playing = false;
    elmCache.static = dataSet.static;
    elmCache.dynamic = dataSet.dynamic;
    imgCache.push(elmCache);
  });

});
