window.optly.mrkt.form = window.optly.mrkt.form || {};

var SigninConst = function(scopeObj) {
  $.each(scopeObj, function(key, val){
    this[key] = val;
  }.bind(this));
};

SigninConst.prototype = {

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
     w.location = '/dashboard';
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

    window.analytics.identify(resp.email, {
      email: resp.email
    });

    //track signin
    window.analytics.track('acount sign-in', {
      category: 'account',
      label: window.location.pathname
    }, {
      Marketo: true
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
  var constructorArgs = {};
  constructorArgs.formElm = document.getElementById(argumentsObj.formId);
  if (argumentsObj.dialogId) {
    constructorArgs.dialogElm = document.getElementById(argumentsObj.dialogId);
  }
  constructorArgs.optionsErrorElm = constructorArgs.formElm.getElementsByClassName('options')[0].querySelector('p:last-child');

  return new SigninConst(constructorArgs);

};
