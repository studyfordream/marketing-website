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

