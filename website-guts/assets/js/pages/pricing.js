/* get the current plan */
var updatePlanInfo = function(){

  if(
    typeof w.optly.mrkt.user === 'object' &&
    typeof w.optly.mrkt.user.acctData === 'object'
  ){

    //remove the sign up form if the user is signed in
    d.querySelector('#starter-plan .action').removeAttribute('data-modal-click');

    if(w.optly.mrkt.user.acctData.plan_id){

        var plan = w.optly.mrkt.user.acctData.plan_id;

        //plan = 'enterprise';

        document.querySelector('body').classList.add('plan-' + plan);

        if(
          plan === 'bronze-monthly' ||
          plan === 'bronze-oneyear' ||
          plan === 'bronze-twoyear' ||
          plan === 'silver-monthly' ||
          plan === 'silver-oneyear' ||
          plan === 'silver-twoyear' ||
          plan === 'gold-monthly' ||
          plan === 'gold-oneyear' ||
          plan === 'gold-twoyear'
        ){

          d.querySelector('#starter-plan .action').setAttribute('data-modal-click', 'downgrade-plan');

        } else {

          $('#starter-plan .action').remove();

        }

    }

  }

};

w.optly_q.push([updatePlanInfo]);

w.optly.mrkt.activeModals.signup.remove();

var signupHelper = w.optly.mrkt.form.createAccount({formId: 'signup-form', dialogId: 'signup-dialog'});

w.optly.mrkt.activeModals = w.optly.mrkt.activeModals || {};

var signupForm  = new Oform({
  selector: '#signup-form',
  customValidation: {
    password1: function(elm) {
      return signupHelper.password1Validate(elm);
    },
    password2: function(elm) {
      return signupHelper.password2Validate(elm);
    }
  }
});

signupForm.on('before', function() {
  //set the hidden input value
  signupHelper.formElm.querySelector('[name="hidden"]').value = 'touched';
  signupHelper.processingAdd();
  if(signupHelper.characterMessageElm.classList.contains('oform-error-show')) {
    signupHelper.characterMessageElm.classList.remove('oform-error-show');
  }
  return true;
});

signupForm.on('validationerror', function(elm) {
  w.optly.mrkt.Oform.validationError(elm);
  signupHelper.showOptionsError('Please Correct Form Errors');
  if(!signupHelper.characterMessageElm.classList.contains('oform-error-show')) {
    signupHelper.characterMessageElm.classList.add('oform-error-show');
  }
});

signupForm.on('error', function() {
  signupHelper.processingRemove({callee: 'error'});
  signupHelper.showOptionsError('An unexpected error occurred. Please contact us if the problem persists.');
  window.analytics.track('create account xhr error', {
    category: 'account',
    label: w.location.pathname
  });
}.bind(signupHelper));

signupForm.on('success', function(event, data){
  signupHelper.pricingSignupSuccess(event, data);
}.bind(signupHelper));

signupForm.on('done', function() {
  window.setTimeout(function() {
    signupHelper.scrollTopDialog();
  }, 500);

  signupHelper.processingRemove({callee: 'done'});
}.bind(signupHelper));

/* downgrade plan */
var downgradeForm = new Oform({
  selector: '#downgrade-plan-form'
}).on('success', function(){
  //to do: turn this into a form helper
  w.optly.mrkt.changePlan({
    plan: 'free-light',
    load: function(event){

      if(event.target.status === 200){

        w.Munchkin.munchkinFunction('visitWebPage', {
          url: '/event/plan/free-light'
        });
        w.analytics.page('/plan/free-light');
        w.analytics.track('change plan', {
          category: 'account',
          label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
        });
        w.analytics.track('/plan/free-light', {
          category: 'account',
          label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
        });
        console.log('plan downgraded from: ' + w.optly.mrkt.user.acctData.plan_id);
        w.analytics.track('plan downgraded', {
          category: 'account',
          label: w.optly.mrkt.user.acctData.plan_id + ' to free-light'
        });

        //show the downgrade confirmation modal
        w.optly.mrkt.modal.open({ modalType: 'downgrade-plan-confirm' });
        $('#downgrade-plan-confirm-cont .close-btn').click(function(){
          console.log('clicked');
          location.reload();
        });

      } else {

        //to do: update the ui for the error
        w.analytics.track('/pricing/change_plan', {
          category: 'api error',
          label: 'pricing signup status not 200: ' + event.target.status
        });

      }

    },
    error: function(event){

      w.analytics.track('/pricing/change_plan', {
        category: 'xmlhttprequest problem',
        label: 'xmlhttprequest error'
      });

    },
    abort: function(event){

      w.analytics.track('/pricing/change_plan', {
        category: 'xmlhttprequest problem',
        label: 'xmlhttprequest error'
      });

    }
  });
});
