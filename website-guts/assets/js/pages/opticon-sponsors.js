$('[data-modal-click="opticon-sponsor-modal"]').on('click', function(e) {
  e.preventDefault();
  window.optly.mrkt.modal.open({modalType: 'opticon-sponsor-modal'});
  $('.js-company-image').css('background-image', this.style.backgroundImage);
  $('.js-company-name').html(this.dataset.name);
  $('.js-company-description').html(this.dataset.description);
});
