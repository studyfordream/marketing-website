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
    });

    $filterElems.bind('click', function(e) {
      e.stopPropagation();
      var $this = $(this);
      if (!$this.hasClass('active')) {
        $this.parent().find('li').not( $this ).removeClass( 'active' );
        $('.selected-option').html($this.text() + ' &#9662;');
        $this.toggleClass( 'active' );
        self.updateIsotope();
        // if mobile, hide menu by removing parent active
        if ($('body').hasClass('mobile')){
          $this.closest('.dropdown-cont').removeClass( 'active' );
        }
        self.updateIsotope();
      }
    });

  },

  isotope: function() {
    $isoContainer = $('.resources-grid').isotope({
      itemSelector: '.resources-grid-elm',
      layoutMode: 'fitRows'
    });

    $('.integrations-message').hide();
  },

  updateIsotope: function() {
    var $activeItem = $filterElems.filter('.active').first(),
        filterString = '.' + $activeItem.data('filter').trim();

    if (filterString === '.all') {
      $isoContainer.isotope({ filter: '*' });
    } else {
      $isoContainer.isotope({ filter: filterString });
    }

    if ( !$isoContainer.data('isotope').filteredItems.length ) {
      $('.integrations-message').show();
    } else {
      $('.integrations-message').hide();
    }
  },

  init: function() {
    this.binder();
    this.isotope();
  }

};

window.optly.mrkt.filter.init();
