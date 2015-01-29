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
