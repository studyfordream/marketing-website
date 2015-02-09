$('#talk-to-us').click(function(e){
  e.preventDefault();
  w.optly.mrkt.modal.open({ modalType: 'contact-sales' });
});

$('#enterprise-cta').click(function(e){
  e.preventDefault();
  w.optly.mrkt.modal.open({ modalType: 'contact-sales' });
});

$('#starter-cta').click(function(e){
  e.preventDefault();
  w.optly.mrkt.modal.open({ modalType: 'signup' });
});

$('#learn-cta').click(w.optly.mrkt.utils.smoothScroll);
$('#plans-cta').click(w.optly.mrkt.utils.smoothScroll);
