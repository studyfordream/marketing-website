$('.js-speaker-info').on('click', function(e) {
  console.log('ham');
  e.preventDefault();
  window.optly.mrkt.modal.open({modalType: 'opticon-sponsor-modal'});
  $('.js-company-image').css('background-image', this.getAttribute('data-image'));
  $('.js-company-name').html(this.getAttribute('data-name'));
  $('.js-company-description').html(this.getAttribute('data-bio'));
});

$('.js-close').on('click', function() {
  window.optly.mrkt.modal.close({modalType: 'opticon-sponsor-modal'});
});
