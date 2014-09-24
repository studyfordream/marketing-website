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

  var currentPage     = $('.for-menu').attr('data-current').split('/')[1],
      currentMenuItem = $('.for-menu').find('a[href*=' + currentPage + ']');

  $(currentMenuItem).removeClass('hide').removeAttr('href').parent().insertBefore($('.for-menu li:first'));
};

window.optly.mrkt.benefitsLayout.menuHandlers();
window.optly.mrkt.benefitsLayout.menuOrder();

new Oform({
  selector: '#contact-form'
})
.on('validationerror', w.optly.mrkt.Oform.validationError)
.on('load', function(event){
  if(event.target.status === 200){
    //identify user
    $('body').addClass('oform-success');
    var response = JSON.parse(event.target.responseText),
        email = d.querySelector('[name="email"]').value,
        traffic = d.querySelector('#traffic');
    w.analytics.identify(email, {
      name: d.querySelector('[name="name"]').value,
      email: email,
      phone: d.querySelector('[name="phone"]').value || '',
      company: d.querySelector('[name="company"]').value || '',
      website: d.querySelector('[name="website"]').value || '',
      utm_Medium__c: window.optly.mrkt.source.utm.medium,
      otm_Medium__c: window.optly.mrkt.source.otm.medium,
      Demo_Request_Monthly_Traffic__c: traffic.options[traffic.selectedIndex].value || '',
      Inbound_Lead_Form_Type__c: d.querySelector('[name="inboundFormLeadType"]').value,
      token: response.token
    }, {
      integrations: {
        Marketo: true
      }
    });
    //track the event
    w.analytics.track('demo requested', {
      category: 'contact form',
      label: w.location.pathname
    }, {
      Marketo: true
    });
  }
});
