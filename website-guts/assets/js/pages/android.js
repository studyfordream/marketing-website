// var $emailInput = $('.android input[type="email"]');
// window.optly.mrkt.anim.placeholderIcons({
//   inputs: $('.android input[type="email"]');
// }); 

$(function() {
  //deal with input icon animation
  window.optly.mrkt.anim.placeholderIcons({inputs: $('.android__content input[type="email"]')});
});

new Oform({
  selector: '.android__content form'
})
.on('validationerror', function( element ) {
  var errorMessage = $(element).data('error');
  $(element).parents('fieldset').after('<p class="oform-error-message">' + errorMessage + '</p>');
})
.on('error', function(e) {
})
.on('success', function(formData) {

  $('.android__content').each(function() {
    var $self = $(this);
    if ( $self.hasClass('is-visible') ) {
      $self.addClass('is-hidden').removeClass('is-visible');
    } else {
      $self.addClass('is-visible').removeClass('is-hidden');
    }
  });

  //tracking code goes here
  w.analytics.identify(formData.data.email, {

    Inbound_Lead_Form_Type__c: 'Android Developer Preview',
    LeadSource: 'Website',
    LeadSourceCategory: 'Content',
    LeadSourceSubcategory: 'PMM',
    email: formData.data.email

  }, {

    Integrations: {
      Marketo: true
    }

  });

  w.Munchkin.munchkinFunction('visitWebPage', {
    url: '/event/form-submit-android-preview'
  });

  w.analtyics.track('android preview success', {

    category: 'forms'

  });
});
