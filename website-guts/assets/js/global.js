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

		$('body').delegate('.mobile-nav-toggle', 'click', function(e){

				$('body').toggleClass('nav-open');

				e.preventDefault();

		});

		$('.user-nav-toggle').click(function(e){

				$('body').toggleClass('user-nav-open');

				e.preventDefault();

		});

    $(window).on('load orientationchange', function() {
      if(window.innerWidth <= 768) {
        $('#main-nav ul').each(function(){

            $(this).css('max-height', $(this).height() + 'px');

        });
      } else {
        $('#main-nav ul').each(function(){

            $(this).css('max-height', '');

        });
      }
    });

		$('body').addClass('mobile-nav-ready');

		$('#main-nav > li').click(function(){

				$(this).toggleClass('active').find('ul').toggleClass('active');

		});

	}

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

	$('form.inline-labels :input').each(function(index, elem) {

			var eId = $(elem).attr('id');

			var label = null;

			if (eId && (label = $(elem).parents('form').find('label[for='+eId+']')).length === 1) {

					$(elem).attr('placeholder', $(label).html());

					$(label).addClass('hide-label');

			}

	});

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
window.Modernizr.addTest('viewportunits', function() {
    var bool;

    window.Modernizr.testStyles('#modernizr { width: 50vw; }', function(elem) {
        var width = parseInt(window.innerWidth/2,10),
            compStyle = parseInt((window.getComputedStyle ?
                      getComputedStyle(elem, null) :
                      elem.currentStyle).width,10);

        bool= (compStyle === width);
    });

    return bool;
});
