function getURLParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);

    return results === null || typeof results === 'undefined' ? false : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function replaceFormAction(oldDomain, newDomain) {
  var formElms = document.getElementsByTagName('form');
  var elm, attr, updateAction;

  for(var i=0; i < formElms.length; i+=1) {
    elm = formElms[i];
    attr = elm.getAttribute('action');
    if(attr !== null && typeof attr !== 'undefined') {
      updateAction = attr.replace(oldDomain, newDomain);
      elm.setAttribute('action', updateAction);
    }
  }
}

var oldApiDomain = window.apiDomain;
var apiDomain = getURLParameter('apiDomain');

if(apiDomain && typeof apiDomain === 'string') {
  window.apiDomain = apiDomain;
  document.addEventListener('DOMContentLoaded', function() {
    replaceFormAction(oldApiDomain, apiDomain);
  });
}
