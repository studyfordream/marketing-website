window.optly.mrkt.anim= window.optly.mrkt.anim || {};

// Autoprefix CSS transition end listener
window.optly.mrkt.anim.transitionend = (function(transition) {
   var transEndEventNames = {
       'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
       'MozTransition'    : 'transitionend',      // only for FF < 15
       'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
  };

  return transEndEventNames[transition];
})(window.Modernizr.prefixed('transition'));

window.optly.mrkt.anim.bindTranEnd = function($elm) {

  $elm.bind(this.transitionend, function() {
   var classList = Array.prototype.slice.call( $elm[0].classList );

    // If the animation is over and modal is closed display none
   if ( classList.indexOf('leave') !== -1 ) {
     $elm.addClass('optly-hide').removeClass('anim-leave leave');

    if( $elm.data('trans-class') ) {
      $elm.removeClass( $elm.data('trans-class') );
    }

     $elm.unbind(this.transitionend, this.bindTranEnd);

     // allow for new click events to trigger animation
     this.elmCache[ $elm.data('anim-cache') ].transitionRunning = false;
   }
   // If the animation is over and modal is open
   else if ( classList.indexOf('anim-enter') !== -1 ) {
    $elm.removeClass('anim-enter');

    if( $elm.data('trans-class') ) {
      $elm.removeClass( $elm.data('trans-class') );
    }

    $elm.unbind(this.transitionend, this.bindTranEnd);

    // allow for new click events to trigger animation
    this.elmCache[ $elm.data('anim-cache') ].transitionRunning = false;
   }
  }.bind(this));

};

window.optly.mrkt.anim.enterQ = function($enterElm) {
  var $q = $({});

  $q.queue('enter', function(next){
    $enterElm.removeClass('optly-hide');
    next();
  });

  $q.queue('enter', function(next){
    $enterElm.addClass('anim-enter');
    next();
  });

  $q.queue('enter', function(next){
    window.setTimeout(function(){
      $enterElm.addClass('enter');
    }, 50);
    next();
  });

  for( var i = 0; i < $q.queue('enter').length; i +=1 ) {
    $q.dequeue('enter');
  }

};

window.optly.mrkt.anim.leaveQ = function($leaveElm) {
  var $q = $({});

  $q.queue('leave', function(next){
    $leaveElm.removeClass('enter');
    next();
  });

  $q.queue('leave', function(next){
    $leaveElm.addClass('anim-leave');
    next();
  });

  $q.queue('leave', function(next){
    window.setTimeout(function(){
      $leaveElm.addClass('leave');
    }, 50);
    next();
  });

  for( var i = 0; i < $q.queue('leave').length; i +=1 ) {
    $q.dequeue('leave');
  }
};

window.optly.mrkt.anim.cacheTrans = function($elm, transClass) {
  var currentElmKey;
  this.elmCache = this.elmCache || {};
  this.cacheKey = this.cacheKey || 0;

  if( !$elm.data('anim-cache') ) {
    currentElmKey = this.cacheKey += 1;
    $elm.data('anim-cache', this.cacheKey);

    this.elmCache[ this.cacheKey ] = {
      elm: $elm
    };

  } else {
    currentElmKey = $elm.data('anim-cache');
  }

  if(transClass) {
    $elm.data('trans-class', transClass);
  }

  return currentElmKey;
};

window.optly.mrkt.anim.enter = function($elm, transClass) {
  var currentElmKey = this.cacheTrans($elm, transClass);

  if(transClass){
    $elm.addClass(transClass);
  }

  if( !this.elmCache[ currentElmKey ].transitionRunning ) {
    this.elmCache[ currentElmKey ].transitionRunning = true;

    this.bindTranEnd($elm);

    this.enterQ($elm);

    return true;
  }

  return false;
};

window.optly.mrkt.anim.leave = function ($elm, transClass) {
  var currentElmKey = this.cacheTrans($elm, transClass);

  if(transClass){
    $elm.addClass(transClass);
  }

  if( !this.elmCache[ currentElmKey ].transitionRunning ) {
    this.elmCache[ currentElmKey ].transitionRunning = true;

    this.bindTranEnd($elm);

    this.leaveQ($elm);

    return true;
  }

  return false;
};
