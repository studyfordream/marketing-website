$('[data-modal-click="opticon-sponsor-modal"]').on('click', function(e) {
  console.log('ahm');
  e.preventDefault();
  window.optly.mrkt.modal.open({modalType: 'opticon-sponsor-modal'});
});
