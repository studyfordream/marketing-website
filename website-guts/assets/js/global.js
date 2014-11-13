window.optly.mrkt.anim= window.optly.mrkt.anim || {};

window.optly.mrkt.isMobile = function(){

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

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
