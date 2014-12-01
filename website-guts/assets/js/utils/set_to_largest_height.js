window.optly.mrkt.utils = window.optly.mrkt.utils || {};

window.optly.mrkt.utils.setToLargestHeight = function(selector) {
  var $selectedElements = $(selector),
      heights = [];

  $selectedElements.each(function(index, element) {
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
   var maxHeight = Math.max.apply(Math, heights);
   $selectedElements.css('height', maxHeight + 'px');
 };
