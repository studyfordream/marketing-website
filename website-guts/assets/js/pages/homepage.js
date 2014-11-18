// Listen for the 'get started' button press
  w.console.log('ASDASD');
$('#get-started').submit(function(e){
  e.preventDefault();

  var inputVal = $('#get-started input[type="email"]').val();

  if( inputVal ){
    w.optly.mrkt.modal.open({ modalType: 'signup' });
    w.body.classList.add('test-it-out-success');
    $('input[type="email"]').val(inputVal);
  } else {
    $('input[type="email"]').focus();
  }
});


//deal with placeholder icons
window.optly.mrkt.anim.placeholderIcons({inputs: $('#get-started input')});
