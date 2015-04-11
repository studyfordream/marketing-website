w.optly.mrkt.automatedTest = function(){

	var uiTest, stagingDomain;

	uiTest = w.optly.mrkt.utils.getURLParameter('uiTest') === 'true';

	stagingDomain = w.location.hostname !== 'www.optimizely.com';

	if(uiTest && stagingDomain){
		return true;
	} else {
		return false;
	}

};
