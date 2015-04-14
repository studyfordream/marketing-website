window.optly.mrkt.benefitsLayout = {};

window.optly.mrkt.benefitsLayout.menuHandlers = function() {

  $('body').delegate('.for-menu', 'click', function(event) {
    event.stopPropagation();
    $(this).toggleClass('shown');
  });

  /* Close menu when clicking away */
  $('html').click(function() {
    $('.for-menu').removeClass('shown');
  });
};

window.optly.mrkt.benefitsLayout.menuOrder = function() {
  /* Changes the order of menu items and disables the current link */
  var firstItem = $('.for-menu li:first');
  var currentMenuItem = $('.for-menu').find('.active');

  $(currentMenuItem).removeClass('hide').removeAttr('href').parent().insertBefore(firstItem);
};

window.optly.mrkt.benefitsLayout.menuHandlers();
window.optly.mrkt.benefitsLayout.menuOrder();
$('[name="hidden"]').val('touched');
w.optly.mrkt.Oform.initContactForm({selector: '#contact-form'});
