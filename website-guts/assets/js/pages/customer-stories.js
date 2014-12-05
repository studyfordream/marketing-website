$(function() {
  if(!Modernizr.flexbox) {
    window.optly.mrkt.utils.equalHeightGrid({
      selector: '.customer-grid-elm',
      responsive: true
    });
  }
});

