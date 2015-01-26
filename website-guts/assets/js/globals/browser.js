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

