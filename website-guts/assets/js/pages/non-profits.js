function smoothScroll(e) {
  var scrlId, 
    targetElmPos;
  if(this !== window) {
    smoothScroll.cacheElm = $(this).attr('href');
  } 

  scrlId = smoothScroll.cacheElm;
  targetElmPos = $(scrlId).offset().top;

  if(typeof e !== 'number') {
    e.preventDefault();
  }

  if($(window).scrollTop() <= targetElmPos && ($(window).scrollTop() + $(window).height()) < $(document).height() ) {
    if(window.requestAnimationFrame) {
      $(window).scrollTop( $(window).scrollTop() + 50 );
      window.requestAnimationFrame(smoothScroll);
    } else {
      $('html,body').animate({
        scrollTop: targetElmPos
      }, 1000);
    }
    
  }

}


$(function(){
  if(!window.optly.mrkt.isMobile()) {
    window.skrollr.init();
  }

  $('[smooth-scroll]').on('click', smoothScroll);

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
