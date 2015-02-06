// Listen for the 'get started' button press
$('#get-started').submit(function(e){
  e.preventDefault();

  var inputVal = $('#get-started input[type="email"]').val();

  if( inputVal ){
    w.optly.mrkt.modal.open({ modalType: 'signup' });
    d.body.classList.add('test-it-out-success');
    $('#signup-form input[type="email"]').val(inputVal);

    var emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegEx.test(inputVal)) {
      var anonymousVisitorIdentifier = window.optly.mrkt.utils.randomString();
      w.analytics.identify(
        anonymousVisitorIdentifier,
        { email: inputVal },
        { integrations: { Marketo: true } }
      );
    }

  } else {
    $('input[type="email"]').focus();
  }
});

//deal with placeholder icons
window.optly.mrkt.anim.placeholderIcons({inputs: $('#get-started input')});
