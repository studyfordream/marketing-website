$('.js-speaker-info').on('click', function(e) {
  e.preventDefault();
  window.optly.mrkt.modal.open({modalType: 'opticon-sponsor-modal', staticModal: true});
  $('.js-speaker-image').css('background-image', this.getAttribute('data-image'));
  $('.js-speaker-name').html(this.getAttribute('data-name'));
  $('.js-speaker-company').html(this.getAttribute('data-company'));
  $('.js-speaker-description').html(this.getAttribute('data-bio'));
});

$('.js-close').on('click', function() {
  window.optly.mrkt.modal.close({modalType: 'opticon-sponsor-modal'});
});
