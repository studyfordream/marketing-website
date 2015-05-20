var signinDialogHelperInst = window.optly.mrkt.form.signin({formId: 'signin-form'});
var signinFormSelector = '#signin-form';

var signinFormEmail = $('#signin-form-email');
var signinFormPasswordLabel = $('#signin-form-password-label');
var signinFormSSOCheckbox = $('#signin-form-sso-checkbox');
var isSSOSubmission = signinFormSSOCheckbox.checked;

$(signinFormSelector).on('submit', function(event) {
  event.preventDefault();

  if (isSSOSubmission) {
    // Login with single sign-on
    $.ajax({
      type: 'POST',
      // Change this to use a global variable for the prefix
      url: '//app.optimizely.com' + '/sp_initiated_signin',
      data: {
        email: signinFormEmail.val()
      },
      xhrFields: {
        withCredentials: true
      }
    });
  } else {
    // Login with username and password
    var signinForm = new Oform({
      selector: signinFormSelector,
      customValidation: {
        password: function(elm) {
          return signinDialogHelperInst.passwordValidation(elm);
        }
      },
      middleware: w.optly.mrkt.Oform.defaultMiddleware
    });

    signinForm.on('before', function() {
      signinDialogHelperInst.processingAdd();
      return true;
    });

    signinForm.on('validationerror', w.optly.mrkt.Oform.validationError);

    signinForm.on('error', function() {
      signinDialogHelperInst.processingRemove({callee: 'error'});
      signinDialogHelperInst.showOptionsError({error: 'UNEXPECTED'});
      window.analytics.track('signin xhr error', {
        category: 'account',
        label: w.location.pathname
      }, {
        integrations: {
          Marketo: false
        }
      });
    }.bind(signinDialogHelperInst));

    signinForm.on('load', signinDialogHelperInst.load.bind(signinDialogHelperInst));

    signinForm.on('done', function(){
      signinDialogHelperInst.processingRemove({callee: 'done'});
      if (document.body.classList.contains('oform-error')) {
        signinDialogHelperInst.showOptionsError();
      }
    }.bind(signinDialogHelperInst));
  }
});

signinFormSSOCheckbox.change(function() {
  isSSOSubmission = this.checked;
  signinFormPasswordLabel.toggle(!isSSOSubmission);
});
