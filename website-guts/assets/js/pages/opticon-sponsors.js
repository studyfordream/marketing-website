$('[data-modal-click="opticon-sponsor-modal"]').on('click', function(e) {
  e.preventDefault();
  window.optly.mrkt.modal.open({modalType: 'opticon-sponsor-modal'});
});
