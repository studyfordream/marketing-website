window.optly.mrkt.tooltip = window.optly.mrkt.tooltip || {};

window.optly.mrkt.tooltip.showTipEvent = function(e) {
  if (!this.tipOpen) {
    this.tipOpen = true;

    if(!window.optly.mrkt.isMobile()) {
      $('body').css({
        cursor: 'pointer'
      });
    }

    // determine the type of tooltip and bind the target and tooltip elements to the object scope
    this.$targetElm = $(e.target);
    this.$tooltipElm = this.$targetElm.find('[data-tooltip-dialog]');

    //initiate the animation queue
    this.tooltipQ = this.initTipQ();

    //set tooltip text
    this.$tooltipElm.text( this.$targetElm.attr('title') );

    for(var i = 0; i < this.tooltipQ.queue('showTip').length; i += 1) {
      this.tooltipQ.dequeue('showTip');
    }

  }

};

window.optly.mrkt.tooltip.init = function($targets) {
  this.$targets = $targets;
  this.$targets.each(function(i, elm) {
    var $targetElm = $(elm);

    if ( $targetElm.data('tooltip') ) {
      $('<div data-tooltip-dialog="' + $targetElm.data('tooltip') + '"></div>')
        .attr('class', 'optly-hide ' + $targetElm.data('tooltip'))
        .appendTo($targetElm);
    } else {
      $('<div data-tooltip-dialog></div>')
        .attr('class', 'optly-hide')
        .appendTo($targetElm);
    }
  });

  this.$targets.on('mouseover click', this.showTipEvent.bind(this));
};

window.optly.mrkt.tooltip.positionTip = function() {
  var $q = $({});

  if ( window.Modernizr.viewportunits ) {
    $q.queue('positionTip', function(next) {
      if( $( window ).width() <= 768 ) {
        this.$tooltipElm.css({
          width: window.innerWidth * 0.4 + 'px'
        });
      } else {
        this.$tooltipElm.css({
          width: ''
        });
      }
      next();
    }.bind(this));
  }

  $q.queue('positionTip', function(next) {
    this.configTooltip();
    next();
  }.bind(this));

  for(var i = 0; i < $q.queue('positionTip').length; i += 1) {
    $q.dequeue('positionTip');
  }

};

window.optly.mrkt.tooltip.clickOffClose = function(e) {
  e.stopImmediatePropagation();
  //uncomment below if want not close the tooltip when clicking on trigger when tip open
  //if (!this.$tooltipElm.is(e.target) && this.$tooltipElm.has(e.target).length === 0 && e.target !== this.$targetElm[0]) {
  if ( !this.$tooltipElm.is(e.target) && this.$tooltipElm.has(e.target).length === 0 ) {
    this.tipOpen = false;

    if(!window.optly.mrkt.isMobile()) {
      $('body').css({
        cursor: 'default'
      });
    }

    window.optly.mrkt.anim.leave(this.$tooltipElm);
    $(document).off('click');
  }
};

window.optly.mrkt.tooltip.initTipQ = function() {
  var $q = $({});

  $q.queue('showTip', function(next) {
    window.optly.mrkt.anim.enter(this.$tooltipElm);
    next();
  }.bind(this));

  $q.queue('showTip', function(next) {
    this.positionTip();
    next();
  }.bind(this));

  $q.queue('showTip', function(next) {
    this.positionTip();
    next();
  }.bind(this));

  $q.queue('showTip', function(next) {
    $(window).on('resize', this.positionTip.bind(this));
    next();
  }.bind(this));

  $q.queue('showTip', function(next) {
    window.setTimeout(function(){
      $(document).on('click', this.clickOffClose.bind(this));
    }.bind(this), 100);
    next();
  }.bind(this));

  return $q;
};

window.optly.mrkt.tooltip.toggleClass = function(added) {
  var rgx = /tip/g;
  $(this.$tooltipElm.attr('class').split(' ')).each(function(index, cls) {
    if( rgx.test(cls) ) {
      this.$tooltipElm.removeClass(cls);
    }
  }.bind(this));
  if(added) {
    this.$tooltipElm.addClass(added);
  }
};

window.optly.mrkt.tooltip.configTooltip = function() {
  var targetPosTop,
    targetPosLeft,
    tipHorizontalOffset,
    tipVerticalOffset,
    posTop,
    posLeft,
    currentTip;

  tipHorizontalOffset = this.$tooltipElm.outerWidth() / 2;
  tipVerticalOffset = this.$tooltipElm.outerHeight() + this.$targetElm.outerHeight() + 10;
  targetPosLeft = this.$targetElm.offset().left;
  targetPosTop  = this.$targetElm.offset().top - $('body').scrollTop();

  if( targetPosLeft + this.$targetElm.outerWidth() / 2 + tipHorizontalOffset >= window.innerWidth ) {
    currentTip = 'right-tip';
    posTop = this.$targetElm.outerHeight() / 2 - this.$tooltipElm.outerHeight() / 2;
    posLeft =  -(this.$tooltipElm.outerWidth() + 10);
  } else if( targetPosLeft + this.$targetElm.outerWidth() / 2 - tipHorizontalOffset <= 0 ){
    currentTip = 'left-tip';
    posTop = this.$targetElm.outerHeight() / 2 - this.$tooltipElm.outerHeight() / 2;
    posLeft = this.$targetElm.outerWidth() + 10;
  } else if(currentTip === undefined) {
    posTop = -(this.$tooltipElm.outerHeight() + 10);
    posLeft = this.$targetElm.outerWidth() / 2 - this.$tooltipElm.outerWidth() / 2;
  }

  this.$tooltipElm.css({
    top: posTop + 'px',
    left: posLeft + 'px'
  });

  if(currentTip) {
    this.toggleClass(currentTip);
  } else if (this.lastTip) {
    this.$tooltipElm.removeClass(this.lastTip);
  }

  this.lastTip = currentTip;

};

$(function() {
  var $targetElms = $('[data-tooltip]');

  window.optly.mrkt.tooltip.init($targetElms);
});
