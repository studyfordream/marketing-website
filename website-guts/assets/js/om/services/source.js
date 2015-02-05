/*
'medium' is one of the following (in this order):
  utm_medium URI parameter = visitor came from an ad campaign
  'organic' = comes from a search engine
  'referred' = comes from a third party non-search website
  'direct' = directly typed in url, or otherwise not one of the other three
*/

var campaign,
    content,
    medium,
    source,
    keyword,
    otmCampaign,
    otmContent,
    otmMedium,
    otmSource,
    otmKeyword,
    urlParam,
    gclid,
    signupPlatform;

urlParam = window.optly.mrkt.utils.getURLParameter;

campaign = urlParam('utm_campaign') || '';
content = urlParam('utm_content') || '';
medium = urlParam('utm_medium') || '';
source = urlParam('utm_source') || '';
keyword = urlParam('utm_keyword') || '';
otmCampaign = urlParam('otm_campaign') || '';
otmContent = urlParam('otm_content') || '';
otmMedium = urlParam('otm_medium') || '';
otmSource = urlParam('otm_source') || '';
otmKeyword = urlParam('otm_keyword') || '';
gclid = urlParam('gclid') || '';
// Parameter specifies which platform (e.g. ios vs. web) user signed-up from
signupPlatform = urlParam('signup_platform') || '';

if(!medium && !otmMedium){

  var referrer,
      isSearchReferral,
      searchTest;

  referrer = document.referrer;

  isSearchReferral = false;

  // Check if referrer is a search engine
  searchTest = [
    'google\\.\\w{2,3}(\\.\\w{2,3})?/(search|url)',
    'bing\\.\\w{2,3}(\\.\\w{2,3})?/(search|url)',
    'yahoo\\.\\w{2,3}(\\.\\w{2,3})?/search',
    'baidu\\.\\w{2,3}(\\.\\w{2,3})?/s?'
  ];

  for (var i = 0; i < searchTest.length; i++) {

    var searchRegExp = searchTest[i];

    if (referrer.match(searchRegExp)) {

      medium = 'organic';

      otmMedium = 'organic';

    }

  }

}

// Finally, if it's STILL blank then it must be direct traffic
if (!medium && !otmMedium) {

    medium = 'direct';

    otmMedium = 'direct';

}

var source = window.optly.mrkt.source = {
  utm: {
    campaign: campaign,
    content: content,
    medium: medium,
    source: source,
    keyword: keyword
  },
  otm: {
    campaign: otmCampaign,
    content: otmContent,
    medium: otmMedium,
    source: otmSource,
    keyword: otmKeyword
  },
  gclid: gclid,
  signupPlatform: signupPlatform
};
