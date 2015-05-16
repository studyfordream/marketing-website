console.log('partners_become.js');

$('.join-link.technology-form').on('click', function(e){
  e.preventDefault();
  w.optly.mrkt.modal.open({ modalType: 'become-partner-technology' });
});

$('.join-link.solutions-form').on('click', function(e){
  e.preventDefault();
  w.optly.mrkt.modal.open({ modalType: 'become-partner-solutions' });
});
