$('#talk-to-us').click(function(e){
  e.preventDefault();
  w.optly.mrkt.modal.open({ modalType: 'contact-sales' });
});

$('#feature-list-talk-to-us').click(function(e){
  e.preventDefault();
  w.optly.mrkt.modal.open({ modalType: 'contact-sales' });
});

$('#feature-list-get-started-now').click(function(e){
  e.preventDefault();
  w.optly.mrkt.modal.open({ modalType: 'signup' });
});

$('#explore-features').click(w.optly.mrkt.utils.smoothScroll);
