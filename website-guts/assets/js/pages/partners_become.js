console.log('partners_become.js');

$('.join-link').on('click', function(e){
  e.preventDefault();
  w.optly.mrkt.modal.open({ modalType: 'become-partner-technology' });
});
