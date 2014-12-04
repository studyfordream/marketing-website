window.optly.mrkt.utils = window.optly.mrkt.utils || {};

/**
   * Set all elements within the collection to have the same height.
   */
$.fn.equalHeight = function(){
  var heights = [];
  $.each(this, function(i, element){
    var $element = $(element);
    var element_height;

    // Should we include the elements padding in it's height?
    var includePadding = ($element.css('box-sizing') === 'border-box') || ($element.css('-moz-box-sizing') === 'border-box');
    if (includePadding) {
      element_height = $element.innerHeight();
    } else {
      element_height = $element.height();
    }
    heights.push(element_height);
  });
  this.height(Math.max.apply(window, heights));
  return this;
};

/**
 * Create a grid of equal height elements.
 */
$.fn.equalHeightGrid = function(columns){
  var $tiles = this;
  $tiles.css('height', 'auto');
  for (var i = 0; i < $tiles.length; i++) {
    if (columns) {
      var row = $($tiles[i]);
      for(var n = 1;n < columns;n++){
        row = row.add($tiles[i + n]);
      }
      row.equalHeight();
    }
  }
  return this;
};

/**
 * Detect how many columns there are in a given layout.
 */
$.fn.detectGridColumns = function() {
  var offset = 0, cols = 0;
  this.each(function(i, elem) {
    var elem_offset = $(elem).offset().top;
    if (offset === 0 || elem_offset === offset) {
      cols++;
      offset = elem_offset;
    } else {
      return false;
    }
  });
  return cols;
};

/**
 * Ensure equal heights now, on ready, load and resize.
 */
$.fn.responsiveEqualHeightGrid = function() {
  var _this = this;
  function syncHeights() {
    var cols = _this.detectGridColumns();
    _this.equalHeightGrid(cols);
  }
  $(window).bind('resize load', syncHeights);
  if(window.innerWidth > 768) {
    syncHeights();
  } else {
    $.each(this, function(i, elm) {
      elm.css.height = 'auto';
    });
  }
  return this;
};


window.optly.mrkt.utils.equalHeightGrid = function(options) {
  var $selector = $(options.selector);
  if(options.responsive) {
    $selector.responsiveEqualHeightGrid();
  } else{
    $selector.equalHeight();
  }
};
