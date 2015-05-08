window.optly.mrkt.form = window.optly.mrkt.form || {};

var signinHelper = {

  passwordValidation: function(elm) {
    this.beforeValidateEmail();
    if(elm.value.length > 0) {
      return true;
    } else {
      return false;
    }
  },

  beforeValidateEmail: function() {
    var emailInput = this.formElm.querySelector('[name="email"]');
    var emailErrorElm = this.formElm.querySelector('.email-related');
    // these custom validations are present because email is no validate because of legacy clients
    // still want to use input type=email for mobile keyboard reasons but don't want oform to validate as email
    if(emailInput.value.length === 0) {
      this.addErrors([emailInput, emailErrorElm]);
      this.showOptionsError();
    } else {
      this.removeErrors([emailInput, emailErrorElm]);
    }
  },

  load: function(e) {
    var resp = this.parseResponse(e),
      pricingPath = /pricing\-page/.test(document.body.getAttribute('class'));

    w.optly.mrkt.setAttributeCookie(resp);
    w.optly.identifyVisitorAttributes();

    var snippetInstalled = false;
    if (resp && !pricingPath) {
      if(typeof resp.has_installed_snippet === 'string'){
        if(resp.has_installed_sippet === true){
          snippetInstalled = true;
        } else {
          snippetInstalled = false;
        }
      } else {
        snippetInstalled = false;
      }
      w.analytics.identify({
        'Snippet installed': snippetInstalled
      });
      this.redirectHelper({
        redirectPath: w.apiDomain + '/dashboard',
        bodyClass: 'signed-in',
        bodyData: {
          formSuccess: this.formElm.getAttribute('action')
        }
      });
    }
    else if(resp) {
      window.optly.mrkt.modal.close({ modalType: 'signin', trace: false });

      var expParams = {
        type: 'GET',
        url: '/experiment/load_recent?max_experiments=5',
        properties: {
          experiments: {
            id: 'number',
            description: 'string',
            has_started: 'boolean',
            can_edit: 'boolean'
          }
        }
      };
      //uses xhr service to track any request errors
      var deferred = window.optly.mrkt.services.xhr.makeRequest(expParams);

      deferred.then(function(expData) {
        window.optly_q.acctData = resp;
        window.optly_q.expData = expData;
        window.optly_q.push([window.optly.mrkt.showUtilityNav, 'acctData', 'expData']);
      });
    }

    w.analytics.identify(resp.unique_user_id, {
      email: resp.email,
      Email: resp.email
    }, {
      integrations: {
        Marketo: true
      }
    });

    w.Munchkin.munchkinFunction('associateLead', {
      Email: resp.email
    }, resp.munchkin_token);

    //track signin
    w.analytics.track('acount sign-in', {
      category: 'account',
      label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
    }, {
      integrations: {
        Marketo: false
      }
    });

    w.Munchkin.munchkinFunction('visitWebPage', {
      url: '/account/signed-in'
    });

    //track customer type
    if(resp.subscription_plan) {
      /* legacy reportin - to be deprecated */
      w.analytics.track('/customer/signed-in', {
        category: 'account',
        label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
      }, {
        integrations: {
          Marketo: false
        }
      });
      w.Munchkin.munchkinFunction('visitWebPage', {
        url: '/customer/signed-in'
      });
      /* new reporting */
      w.analytics.track('customer sign in', {
        category: 'account',
        label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
      }, {
        integrations: {
          Marketo: false
        }
      });
    }

  }

};

window.optly.mrkt.form.signin = function(argumentsObj) {
  var constructorArgs = {
    formId: argumentsObj.formId,
    dialogId: argumentsObj.dialogId,
    prototype: signinHelper
  };

  return window.optly.mrkt.form.HelperFactory(constructorArgs);

};
