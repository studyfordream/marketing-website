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

w.optly.mrkt.formHadError = false;

window.optly_q.push([function(){

	if(typeof w.optly_q.acctData === 'object'){

		window.analytics.ready(function(){

			w.Munchkin.munchkinFunction('associateLead', {

				Email: w.optly_q.acctData.email

			}, w.optly_q.acctData.munchkin_token);

		});

              var anonymousVisitorIdentifier = window.optly.mrkt.utils.randomString();
		window.analytics.identify(anonymousVisitorIdentifier, {
			name: w.optly_q.acctData.name,
			email: w.optly_q.acctData.email,
      Email: w.optly_q.acctData.email
		});

	}

}]);

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
