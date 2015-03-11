$('[name="hidden"]').val('touched');

var eventsFormHelperInst = window.optly.mrkt.form.eventsForm({formId: 'events-form'});

new Oform({
  selector: '#events-form'
})
.on('validationerror', w.optly.mrkt.Oform.validationError)
.on('error', eventsFormHelperInst.error.bind(eventsFormHelperInst))
.on('load', eventsFormHelperInst.success.bind(eventsFormHelperInst));
