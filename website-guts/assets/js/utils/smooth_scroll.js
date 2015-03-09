window.optly.mrkt.utils.smoothScroll = function(event) {

	var targetElmPos = $(this.getAttribute('href')).offset().top;

	event.preventDefault();

	$('html,body').animate({
		scrollTop: targetElmPos
	}, 1000);
};
