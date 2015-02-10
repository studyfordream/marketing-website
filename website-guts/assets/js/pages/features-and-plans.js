$('#talk-to-us').on('click', function(e){
  e.preventDefault();
  w.optly.mrkt.modal.open({ modalType: 'contact-sales' });
});

$('#enterprise-cta').on('click', function(e){
  e.preventDefault();
  w.optly.mrkt.modal.open({ modalType: 'contact-sales' });
});

$('#starter-cta').on('click', function(e){
  e.preventDefault();
  w.optly.mrkt.modal.open({ modalType: 'signup' });
});

$('#learn-cta').on('click', w.optly.mrkt.utils.smoothScroll);
$('#plans-cta').on('click', w.optly.mrkt.utils.smoothScroll);
