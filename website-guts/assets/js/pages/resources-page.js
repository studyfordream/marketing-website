//window.optly.mrkt.resourcesPage = {};

//var $dropdownElems = $('.dropdown-cont');

//window.optly.mrkt.resourcesPage.filter = function() {
    //$dropdownElems.on('click', function(e) {
      //e.preventDefault();
      //var $this = $(this);
      //$dropdownElems.not( $this ).addClass( 'active' );
      //debugger;
    //});
//};

//window.optly.mrkt.resourcesPage.filter();
var $dropdownElems = $('.dropdown-cont');
var $filterElems = $('.filter-item');
var $isoContainer;

// FUNCTIONS
window.optly.mrkt.filter = {

  binder: function() {

    var self = this;

    $dropdownElems.on('click', function(e) {
      e.preventDefault();
      var $this = $(this);
      $dropdownElems.not( $this ).removeClass( 'active' );
      $this.mouseleave(function(){
        $this.removeClass( 'active' );
      });
      $this.toggleClass( 'active' );

      // $(window).not( $dropdownElems ).on('click', function() {
      //   $dropdownElems.removeClass( 'active' );
      // });
    });

    $filterElems.bind('click', function(e) {
      e.stopPropagation();
      var $this = $(this);
      $this.parent().find('li').not( $this ).removeClass( 'active' );
      $this.toggleClass( 'active' );
      self.updateIsotope();
      // if mobile, hide menu by removing parent active
      if ($('body').hasClass('mobile')){
        $this.closest('.dropdown-cont').removeClass( 'active' );
      }
      self.updateIsotope();
    });

  },

  isotope: function() {

    var heights = [];

    $('.partner-grid-elm').each( function() {
      heights.push( $(this).outerHeight() );
    });

    heights = heights.sort().reverse();

    $('.partner-grid-elm').each( function() {
      $(this).height( heights[0] );
    });

    $('.integrations-container').css('min-height', heights[0]);

    $isoContainer = $('.partner-grid').isotope({
      itemSelector: '.partner-grid-elm',
      layoutMode: 'fitRows'
    });
  },

  updateIsotope: function() {
    var $activeItems = $filterElems.filter('.active');
    var values = [];

    $activeItems.each( function() {
      var value = $(this).data( 'filter' ).trim();
      values.push( '.' + value );
    });

    var filterValue = values.join('');
    $isoContainer.isotope({ filter: filterValue });

    // create a div#output to enable classname debugging
    // var $output = $('#output');
    // $output.text( filterValue );

    if ( !$isoContainer.data('isotope').filteredItems.length ) {
      $('.integrations-message').addClass('visible');
    } else {
      $('.integrations-message').removeClass('visible');
    }

  },

  init: function() {
    this.binder();
    this.isotope();
  }

};

window.optly.mrkt.filter.init();
