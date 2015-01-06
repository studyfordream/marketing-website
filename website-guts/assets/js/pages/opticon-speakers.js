$('.form-success').hide();

var opticonSpeakerHelper = window.optly.mrkt.form.opticonSpeakerForm({formId: 'speaker-form'});

$(opticonSpeakerHelper.formElm).on('submit', function(e) {
  e.preventDefault();
  this.validateForm();
}.bind(opticonSpeakerHelper));
