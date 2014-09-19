window.optly                = window.optly || {};
window.optly.mrkt           = window.optly.mrkt || {};
window.optly.mrkt.services  = window.optly.mrkt.services || {};
window.optly.mrkt.user      = window.optly.mrkt.user || {};

window.optly.mrkt.optly_QFactory = function(acctData, expData) {
  this.acctData = acctData;
  this.expData = expData;
  window.optly.PRELOAD.token = acctData.csrf_token;

  this.transformQuedArgs = function(quedArgs) {
    $.each(quedArgs, function(index, arg) {
      if (this[ arg ] !== undefined) {
        quedArgs[ index ] = this[ arg ];
      }
    }.bind(this));
  };

  this.parseQ = function(fnQ, i) {
    var quedArgs;
    if (typeof fnQ[i] === 'function') {
      quedArgs = fnQ.slice(1);

      this.transformQuedArgs(quedArgs);

      fnQ[i].apply( fnQ[i], quedArgs );
    }
    else {
      for(var nestedI = 0; nestedI < fnQ[i].length; nestedI += 1) {

        if (typeof fnQ[i][nestedI] === 'function') {
          quedArgs = fnQ[i].slice(1);

          this.transformQuedArgs(quedArgs);

          fnQ[i][nestedI].apply( fnQ[i][nestedI], quedArgs );
        }
      }
    }
  };

  this.push = function(fnQ) {
    for (var i = 0; i < fnQ.length; i += 1) {
      this.parseQ(fnQ, i);
    }
  };

  this.userData = {
    account: this.acctData,
    experiments: this.expData
  };

};

window.optly.mrkt.services.xhr = {
  makeRequest: function(request) {
    var deffereds = [], defferedPromise;

    // check if multiple requests are present
    if ( Array.isArray(request) ) {
      for (var i = 0; i < request.length; i += 1) {
        if (typeof request[i] === 'object') {
          defferedPromise = $.ajax({
            type: request[i].type,
            url: request[i].url
          });
          // parameters passed must be objects with a path and properties keys
          if (request[i].properties !== undefined) {
            this.handleErrors( defferedPromise, request[i].url, request[i].properties );
          }

          deffereds.push( defferedPromise );

        }
      }
      this.resolveDeffereds(deffereds);
      return deffereds;
    }
    // If single request, then return the promise directly
    else {
      defferedPromise = $.ajax({
        type: request.type,
        url: request.url
      });
      if (request.properties !== undefined) {
        this.handleErrors( defferedPromise, request.url, request.properties );
      }
      return defferedPromise;
    }
  },

  logSegmentError: function(url, category, errorMessage) {
    window.analytics.track(url, {
      category: category,
      label: errorMessage
    });
  },

  validateTypes: function(resp, properties, url) {
    var errorMessage;
    $.each(properties, function(property, type) {
      // if property is not nested
      if(typeof type !== 'object') {
        if (typeof resp[ property ] !== type) {
          errorMessage = 'resp.' + property + ' is not a ' + type + ': ' + typeof(resp[ property ]);

          this.logSegmentError(url, 'api error', errorMessage);
        }
      }
      // if property is nested
      else {

        this.validateNestedTypes( resp[ property ], properties[ property ], property, type, url );

      }
    }.bind(this)); // end outer .each
  },

  validateNestedTypes: function(data, nestedData, parentProperty, type, url) {
    var errorMessage,
      propertyType;
    // if the property maps to an array
    if ( Array.isArray(data) ) {

      $.each(data, function(index, innerProperties) {

        $.each(nestedData, function(innerProp, innerType) {
          propertyType = typeof innerProperties[ innerProp ];
          if (propertyType !== innerType) {
            errorMessage = 'resp.' + parentProperty + '.' + innerProp + ' is not a ' + innerType + ': ' + propertyType;

            this.logSegmentError(url, 'api error', errorMessage);
          }
        }.bind(this));

      }.bind(this));
    }
    // if the property maps to an object
    else {
      $.each(type, function(innerProp, innerType) {
        propertyType = typeof data[ innerProp ];
        if (propertyType !== innerType) {
          errorMessage = 'resp.' + parentProperty + '.' + innerProp + ' is not a ' + innerType + ': ' + propertyType;

          this.logSegmentError(url, 'api error', errorMessage);
        }
      }.bind(this));
    }
  },

  handleErrors: function(deffered, url, properties) {
    var parsedRes, errorMessage;

    deffered.always(function(data, textStatus, jqXHR) {

        // check if the last argument is a promise, if so the response was successful
        if( this.isPromise(jqXHR) && jqXHR.status === 200 ) {

          //parse JSON and catch any errors -- if error return immediately
          try {
            parsedRes = $.parseJSON(jqXHR.responseText);
          } catch (error) {

            this.logSegmentError(url, 'api error', 'response contains invalid json ' + error);

            // do not check validations if parse error
            return undefined;
          }

          // validate each property type
          this.validateTypes(parsedRes, properties, url);

        }
        // if the http request fails the jqXHR object will not be promise
        else {
          // in this case the data object is a promise so we parse it's response text
          if ( this.isPromise(data) && data.status === 200) {
            try {
              parsedRes = $.parseJSON(data.responseText);
            } catch (error) {
              errorMessage = error + ', Response Text: ' + data.responseText + ', Status Text: ' + data.statusText + ', Status: ' + data.status;
            }
          }
          if (errorMessage === undefined) {
            errorMessage = 'Response Text: ' + data.responseText + ', Status Text: ' + data.statusText + ', Status: ' + data.status;
          }

          this.logSegmentError(url, 'api error', errorMessage);

        }

    }.bind(this));

  },

  isPromise: function(value) {

    if (typeof value.then !== 'function') {
        return false;
    }
    var promiseThenSrc = String($.Deferred().then);
    var valueThenSrc = String(value.then);
    return promiseThenSrc === valueThenSrc;
  },

  resolveDeffereds: function(deffereds) {
    var responses = [], oldQue;
    $.when.apply($, deffereds).done(function() {
      // get all arguments returned from done
      var tranformedArgs = Array.prototype.slice.call(arguments);
      $.each(tranformedArgs, function(index, resp) {
        var respData = resp[0];
        if( !this.isPromise( respData ) && resp[1] === 'success' ) {
          responses.push(respData);
        }
        if (index === tranformedArgs.length - 1) {
          oldQue = window.optly_q;
          // create the global user object properties
          window.optly.mrkt.user = {
            account: responses[0],
            experiments: responses[1]
          };
          // consume qued data
          window.optly_q = new window.optly.mrkt.optly_QFactory(responses[0], responses[1]);
          window.optly_q.push(oldQue);
        }
      }.bind(this) );
    }.bind(this) );

    return true;
  },

  readCookie: function (name) {
    // Escape regexp special characters (thanks kangax!)
    name = name.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');

    var regex = new RegExp('(?:^|;)\\s?' + name + '=(.*?)(?:;|$)','i'),
        match = document.cookie.match(regex);

    return match && window.unescape(match[1]);
  },

  getLoginStatus: function(requestParams) {
    var deferreds;

    if ( !!this.readCookie('optimizely_signed_in') ) {
      deferreds = this.makeRequest(requestParams);
      return deferreds;
    }
  }

};

(function() {
  'use strict';

  var acctParams,
    expParams;

  acctParams = {
    type: 'GET',
    url: '/account/info',
    properties: {
      email: 'string',
      account_id: 'number'
    }
  };

  expParams = {
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

  return window.optly.mrkt.services.xhr.getLoginStatus([acctParams, expParams]);
}());
