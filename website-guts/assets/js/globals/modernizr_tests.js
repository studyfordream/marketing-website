//Test for viewport unit support
Modernizr.addTest('viewportunits', function() {
  var bool;

  Modernizr.testStyles('#modernizr { width: 50vw; }', function(elem) {
    var width = parseInt(window.innerWidth/2,10),
    compStyle = parseInt((window.getComputedStyle ?
                          getComputedStyle(elem, null) :
                          elem.currentStyle).width,10);

    bool= (compStyle === width);
  });

  return bool;
});
