function smoothScroll(e) {
  var scrlId = $(this).attr('href'), 
    targetElmPos = $(scrlId).offset().top;

  e.preventDefault();

  $('html,body').animate({
    scrollTop: targetElmPos
  }, 1000);

}

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
    videoId: 'C7WTDPksvAE'
  });
};

$(function(){
  if(!window.optly.mrkt.isMobile()) {
    window.skrollr.init();
  }

  $('[smooth-scroll]').on('click', smoothScroll);

  $('[data-show-video]').on('click', function() {
    window.optly.mrkt.modal.open({modalType: 'nonprofits-video'});
    var playerInt = window.setInterval(function() {
      if(player.getPlayerState() !== 1) {
        player.playVideo();
      } else {
        window.clearInterval(playerInt);
      }
    }, 10);
  });

  $('[data-optly-modal="nonprofits-video"]').on('click', function() {
    player.stopVideo();
  });

  var orgFormHelperInst = window.optly.mrkt.form.orgForm({formId: 'org-form'});

  var orgForm = new Oform({
    selector: '#org-form'
  });

  orgForm.on('before', function() {
    orgFormHelperInst.processingAdd();
    return true;
  });


  orgForm.on('validationerror', w.optly.mrkt.Oform.validationError);

  orgForm.on('error', function() {
    orgFormHelperInst.processingRemove({callee: 'error'});
    window.analytics.track('signin xhr error', {
      category: 'account',
      label: w.location.pathname
    });
  }.bind());

  orgForm.on('load', orgFormHelperInst.load.bind(orgFormHelperInst));

  orgForm.on('done', function(){
    orgFormHelperInst.processingRemove({callee: 'done'});
  }.bind(orgFormHelperInst));

});
