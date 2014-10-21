var DEFAULT_ERROR_MESSAGE = 'Don\'t worry, most issues are minor - please refresh your browser and try again.';
var errorShown;

function showError(errorMessage, errorId) {
  var info = {
      errorMessage: errorMessage || DEFAULT_ERROR_MESSAGE,
      guid: errorId || window.optly.mrkt.utils.generateGuid(),
      timestamp: window.optly.mrkt.utils.formatDateJson(new Date())
    },
    $errorMsgElm = $('<span>').text(info.errorMessage),
    $errorIdElm = $('<span>').text(info.guid + ' | ' + info.timestamp);

  //TODO if no errorId submit generated GUID to splunk
  //https://github.com/optimizely/optimizely/blob/effa021dfcebdb49ae74ed0982ed0cb99493dbb7/src/www/js/bundle/page.js#L177
  //https://github.com/optimizely/optimizely/blob/devel/src/www/js/bundle/common/errors.js#L90
  $('.optimizely_error').hide();
  $('#optimizely_error_dialog #optimizely_error_type').append($errorMsgElm);
  $('#optimizely_error_dialog #optimizely_error_info').append($errorIdElm);

  if(!errorShown) {
    window.optly.mrkt.modal.open({ modalType: 'error' });
    errorShown = true;
  }
  
  return info;
}

function checkError() {
  var queryParameters = window.optly.mrkt.utils.deparam(window.location.href);
  if (Object.keys(queryParameters).indexOf('error') !== -1) {
    showError(queryParameters.error, queryParameters.error_id);
  }
}

function logError(errorObj) {
  showError(errorObj.error, errorObj.error_id);
}

function ErrorQ(fnCache) {
  this.fnCache = fnCache;
}

ErrorQ.prototype = window.optly.mrkt.Optly_Q.prototype;

var oldErrorQ = window.optly.mrkt.errorQ;

var errorQ = new ErrorQ({logError: logError});

$(function() {

  checkError();

  if(oldErrorQ.length !== 0) {
    errorQ.push(oldErrorQ);
  }
  
});
