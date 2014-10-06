window.optly.mrkt.form = window.optly.mrkt.form || {};

var signinHelper = {

  showOptionsError: function (message){
    if(!document.body.classList.contains('error-state')) {
      document.body.classList.add('error-state');
    }
    if( !this.optionsErrorElm.classList.contains('error-show') ) {
      this.optionsErrorElm.classList.add('error-show');
      this.optionsErrorElm.innerHTML = message;
    }
  },

  passwordValidation: function(elm) {
    this.beforeValidateEmail();
    if(elm.value.length > 0) {
      return true;
    } else {
      return false;
    }
  },

  addError: function(elm) {
    if(!document.body.classList.contains('error-state')) {
      document.body.classList.add('error-state');
    }
    if( !elm.classList.contains('error-show') ) {
      elm.classList.add('error-show');
    }
  },

  removeError: function(elm) {
    if(document.body.classList.contains('error-state')) {
      document.body.classList.remove('error-state');
    }
    if( elm.classList.contains('error-show') ) {
      elm.classList.remove('error-show');
    }
  },

  beforeValidateEmail: function() {
    var emailInput = this.formElm.querySelector('[name="email"]');
    var emailErrorElm = this.formElm.querySelector('.email-related');
    if(emailInput.value.length === 0) {
      $.each([emailInput, emailErrorElm], function(i, elm) {
        this.addError(elm);
      }.bind(this));
    } else {
      $.each([emailInput, emailErrorElm], function(i, elm) {
        this.removeError(elm);
      }.bind(this));
    }
  },

  load: function(e) {
    var resp = JSON.parse(e.target.responseText);
    var path = w.location.pathname;

    if(e.target.status !== 200) {
      this.showOptionsError(resp.error);
      return;
    }

    if(path.substr(-1) === '/') {
      path = path.substr(0, path.length - 1);
    }

    if (path !== '/pricing') {
      // allow analytics logging before redirect
      window.setTimeout(function() {
        w.location = '/dashboard';
      }, 500);
    }
    else {
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

    w.analytics.identify(resp.email, {
      email: resp.email
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
      label: window.location.pathname
    }, {
      Marketo: true
    });

    w.Munchkin.munchkinFunction('visitWebPage', {
      url: '/account/signed-in'
    });

    //track customer type
    if(resp.subscription_plan) {
      /* legacy reportin - to be deprecated */
      window.analytics.track('/customer/signed-in', {
        category: 'account',
        label: w.location.pathname
      }, {
        Marketo: true
      });
      w.Munchkin.munchkinFunction('visitWebPage', {
        url: '/customer/signed-in'
      });
      /* new reporting */
      window.analytics.track('customer sign in', {
        category: 'account',
        label: w.location.pathname
      }, {
        Marketo: true
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

  return new window.optly.mrkt.form.HelperFactory(constructorArgs);

};
