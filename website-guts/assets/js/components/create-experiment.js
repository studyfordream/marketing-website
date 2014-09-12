$('#create-exp-form').on('submit', function() {
  var inputVals = {},
    params = '';

  $(this).find('input').each(function(i, inputElm) {
    var inputName = inputElm.getAttribute('name');
    switch(inputName) {
      case 'url':
          params = (inputName + '=' + window.encodeURIComponent( inputElm.value )) + '&' + params;
        break;
      case 'name':
          params += (inputName + '=' + window.encodeURIComponent( inputElm.value ));
        break;
    }
  });
debugger;  
});
