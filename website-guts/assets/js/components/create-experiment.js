$('#create-exp-form').on('submit', function(e) {
  var uri,
    params = {},
    validationError = false,
    orderQ = ['url'];

  e.preventDefault();

  $(this).find('[required]').each(function(i, elm) {
    var $elm = $(elm);

    if($elm.val().length === 0) {
      $('body').addClass('error-state');
      $elm.parent().find('.' + $elm.attr('name') + '-related').addClass('error-show');
      $elm.addClass('error-show');
      validationError = true;
    }
  });

  if(validationError) {
    return;
  }

  $(this).find('input').each(function(i, inputElm) {
    var inputName = inputElm.getAttribute('name');
    if(!!inputElm.value) {
      params[ inputName ] = inputElm.value;
      
      if(orderQ.indexOf(inputName) === -1) {
        orderQ.push(inputName);
      }

    }
  });

  uri = window.optly.mrkt.utils.param('/edit', params, orderQ);

  window.location = window.location.origin + uri;
});
