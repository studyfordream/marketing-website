$('#test-it-out-form').submit(function(e){

  var inputVal = $('#test-it-out-form input[type="text"]').val();

  if( inputVal ){
     w.optly.mrkt.modal.open({ modalType: 'anonymous-wall' }); 
  } else {
      $('input[type="text"]').focus();
    }

  e.preventDefault();

});
