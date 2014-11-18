window.optly.mrkt.anim= window.optly.mrkt.anim || {};

window.optly.mrkt.isMobile = function(){

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

		return true;

	} else {

		return false;

	}

};

window.optly.mrkt.automatedTest = function(){

	var phantom, stagingDomain;

	phantom = window.optly.mrkt.utils.getURLParameter('phantom') === 'true';

	stagingDomain = window.location.hostname !== 'www.optimizely.com';

	if(phantom && stagingDomain){
		return true;
	} else {
		return false;
	}

};

window.optly.mrkt.mobileJS = function(){

	if( window.optly.mrkt.isMobile() ){

		$('body').addClass('mobile');

		$.getScript(window.optly.mrkt.assetsDir + '/js/libraries/fastclick.js', function(){

			window.FastClick.attach(document.body);

		});

  }

  var querystring = window.optly.mrkt.utils.deparam(window.location.href);

  if( (querystring.site_mode && querystring.site_mode === 'mobile') ) {
    $.cookie('optimizelySiteMode', 'mobile', { path: '/' });
  }

  var mobileNavBound = false;
  $(window).on('load resize', function() {
    if(window.innerWidth <= 960) {
        $('body').addClass('mobile-nav-ready');

        if(!mobileNavBound) {
            $('.mobile-nav-toggle').on('click', function(e){

            $('body').toggleClass('nav-open');

                e.preventDefault();

            });

            $('.user-nav-toggle').on('click', function(e){

                $('body').toggleClass('user-nav-open');

                e.preventDefault();

            });



            $('#main-nav > li').on('click', function(){

                $(this).toggleClass('active').find('ul').toggleClass('active');

            });

            mobileNavBound = true;
        }


    } else {
        $('body').removeClass('mobile-nav-ready');
    }

  });


};

window.optly.mrkt.mobileJS();

//apply active class to active links
window.optly.mrkt.activeLinks = {};

window.optly.mrkt.activeLinks.currentPath = window.location.pathname;

window.optly.mrkt.activeLinks.markActiveLinks = function(){

	$('a').each(function(){

		if(

			$(this).attr('href') === window.optly.mrkt.activeLinks.currentPath ||
			$(this).attr('href') + '/' === window.optly.mrkt.activeLinks.currentPath

		){

			$(this).addClass('active');

		}

	});

};

window.optly.mrkt.activeLinks.markActiveLinks();

window.optly.mrkt.inlineFormLabels = function(){

	if(w.optly.mrkt.browser !== 'Explorer'){

		$('form.inline-labels :input').each(function(index, elem) {

			var eId = $(elem).attr('id');

			var label = null;

			if (eId && (label = $(elem).parents('form').find('label[for='+eId+']')).length === 1) {

				$(elem).attr('placeholder', $(label).html());

				$(label).addClass('hide-label');

			}

		});

	}

};

window.optly.mrkt.formDataStringToObject = function getJsonFromUrl(string) {

	var data, result, i;

  data = string.split('&');

  result = {};

  for(i=0; i<data.length; i++) {

    var item = data[i].split('=');

    result[item[0]] = item[1];

  }

  return result;

};

//Test for viewport unit support
Modernizr.addTest('viewportunits', function() {
    var bool;

    Modernizr.testStyles('#modernizr { width: 50vw; }', function(elem) {
        var width = parseInt(window.innerWidth/2,10),
            compStyle = parseInt((window.getComputedStyle ?
                      getComputedStyle(elem, null) :
                      elem.currentStyle).width,10);

        bool= (compStyle === width);
    });

    return bool;
});

window.optly_q.push([function(){

	if(typeof w.optly_q.acctData === 'object'){

		window.analytics.ready(function(){

			w.Munchkin.munchkinFunction('associateLead', {

				Email: w.optly_q.acctData.email

			}, w.optly_q.acctData.munchkin_token);

		});

		window.analytics.identify(w.optly_q.acctData.email, {

			name: w.optly_q.acctData.name,

			email: w.optly_q.acctData.email

		});

	}

}]);

/*
** @param {object} inputs: $(jQuery inputs array)
**
*/

window.optly.mrkt.anim.placeholderIcons = function(options) {
    var $inputs = options.inputs;
    var placeholderCache = {};

    $.each($inputs, function(i, input) {
        var inputName = input.getAttribute('name');

        placeholderCache[inputName] = input.getAttribute('placeholder');
    });

    $inputs.on('focusout', function() {
        if(this.value.length !== 0) {
          this.classList.add('has-input-val');
        } else {
          this.classList.remove('has-input-val');
        }
    });

    $inputs.on('focus', function() {
        this.setAttribute('placeholder', '');
    });

    $inputs.on('blur', function() {
        var inputName = this.getAttribute('name');

        this.setAttribute('placeholder', placeholderCache[inputName]);
    });
};

var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || 'Other';
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'Unknown';
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) !== -1) {
                return data[i].identity;
            }
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index === -1) {
            return;
        }

        var rv = dataString.indexOf('rv:');
        if (this.versionSearchString === 'Trident' && rv !== -1) {
            return parseFloat(dataString.substring(rv + 3));
        } else {
            return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
        }
    },

    dataBrowser: [
        {string: navigator.userAgent, subString: 'Chrome', identity: 'Chrome'},
        {string: navigator.userAgent, subString: 'MSIE', identity: 'Explorer'},
        {string: navigator.userAgent, subString: 'Trident', identity: 'Explorer'},
        {string: navigator.userAgent, subString: 'Firefox', identity: 'Firefox'},
        {string: navigator.userAgent, subString: 'Safari', identity: 'Safari'},
        {string: navigator.userAgent, subString: 'Opera', identity: 'Opera'}
    ]

};

BrowserDetect.init();

window.optly.mrkt.browser = BrowserDetect.browser;

window.optly.mrkt.browserVersion = BrowserDetect.version;

window.optly.mrkt.changePlanHelper = {

	changePlan: function(args){

		/*

			Changes the user's plan.

			args.plan (string) = new plan code
			args.load (function) = when the response on the http request is received, receives the XMLHttpRequestProgressEvent as an argument
			args.abort (function) = when the request is aborted, receives the XMLHttpRequestProgressEvent as an argument
			args.error (function) = when there is an error, receives the XMLHttpRequestProgressEvent as an argument
			args.callback (function) = a callback for the load event, gets passed the load event

		*/

		if(typeof args.plan === 'string' && args.plan){

			var setPlan = new XMLHttpRequest();

			setPlan.addEventListener('load', function(event){

				if(typeof args.load === 'function'){

					if(typeof args.callback === 'function'){

						args.load(event, args.callback);

					} else {

						args.load(event);

					}

				}

			}, false);

			setPlan.addEventListener('abort', function(event){

				if(typeof args.abort === 'function'){

					args.abort(event);

				}

			}, false);

			setPlan.addEventListener('error', function(event){

				if(typeof args.error === 'function'){

					args.error(event);

				}

			}, false);

			setPlan.open('post', '/pricing/change_plan', true);
			setPlan.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			setPlan.send('plan_id=' + args.plan);

		}

	},
	load: function(event, callback){

		/*

			Accepts a callback that gets run 1 second after the reporting finishes

		*/

		if(event.target.status === 200){

			d.body.classList.add('change-plan-success');

			w.Munchkin.munchkinFunction('visitWebPage', {
				url: '/event/plan/free_light'
			});
			w.analytics.page('/plan/free_light');
			w.analytics.track('change plan', {
				category: 'account',
				label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
			});
			w.analytics.track('/plan/free_light', {
				category: 'account',
				label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
			});
			var oldPlan = 'nothing';
			if(
					typeof w.optly.mrkt.user.acctData === 'object' &&
					typeof w.optly.mrkt.user.acctData.plan_id === 'string'
			){
				oldPlan = w.optly.mrkt.user.acctData.plan_id;
			}
			w.analytics.track('plan downgraded', {
				category: 'account',
				label: oldPlan + ' to free_light'
			});

			if(typeof callback === 'function'){

				setTimeout(function(){

					callback(event);

				}, 1000);

			}

		} else {

			//to do: update the ui for the error
			w.analytics.track('/pricing/change_plan', {
				category: 'api error',
				label: 'pricing change plan status not 200: ' + event.target.status
			});

		}

	},
	showDowngradeConfirmation: function(event, callback){

		//show the downgrade confirmation modal
		w.optly.mrkt.modal.open({ modalType: 'downgrade-plan-confirm' });
		$('#downgrade-plan-confirm-cont .close-btn').click(function(){
			if(!w.optly.mrkt.automatedTest()){
				location.reload();
			}
		});

		if(typeof callback === 'function'){
			callback(event);
		}

	},
	error: function(){

		w.analytics.track('/pricing/change_plan', {
			category: 'xmlhttprequest problem',
			label: 'xmlhttprequest error'
		});

	},
	abort: function(){

		w.analytics.track('/pricing/change_plan', {
			category: 'xmlhttprequest problem',
			label: 'xmlhttprequest abort'
		});

	}

};

window.optly.mrkt.utils.smoothScroll = function(event) {

	var targetElmPos = $(event.currentTarget).offset().top;

	event.preventDefault();

	$('html,body').animate({
		scrollTop: targetElmPos
	}, 1000);
};

//pre-populate fields from account info
w.optly_q.push([function(){
	if(typeof w.optly.mrkt.user.acctData === 'object'){
		if(typeof w.optly.mrkt.user.acctData.first_name === 'string'){
			$('[name="first_name"]').val(w.optly.mrkt.user.acctData.first_name);
		}
		if(typeof w.optly.mrkt.user.acctData.last_name === 'string'){
			$('[name="last_name"]').val(w.optly.mrkt.user.acctData.last_name);
		}
		if(
				typeof w.optly.mrkt.user.acctData.first_name === 'string' &&
				typeof w.optly.mrkt.user.acctData.last_name === 'string'
			){
				$('[name="name"]').val(w.optly.mrkt.user.acctData.first_name + ' ' + w.optly.mrkt.user.acctData.last_name);
		}
		if(typeof w.optly.mrkt.user.acctData.email === 'string'){
			$('[name="email"]').val(w.optly.mrkt.user.acctData.email);
			$('[name="email_address"]').val(w.optly.mrkt.user.acctData.email);
		}
	}
}]);
