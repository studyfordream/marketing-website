var tr = require('../utils/client-tr');
var DEFAULT_ERROR_MESSAGE = tr('Don\'t worry, most issues are minor - please refresh your browser and try again.');
var errorCache = [];

function showError(errorMessage, errorId) {
  // translate error message on the fly because TR may not be defined at the time of error reporting
  var info = {
      errorMessage: tr(errorMessage) || DEFAULT_ERROR_MESSAGE,
      guid: errorId || window.optly.mrkt.utils.generateGuid(),
      timestamp: window.optly.mrkt.utils.formatDateJson(new Date())
    },
    $errorMsgElm = $('<span>').text(info.errorMessage),
    $errorIdElm = $('<span>').text(info.guid + ' | ' + info.timestamp);

  if(errorCache.length === 0) {
    window.optly.mrkt.modal.open({ modalType: 'error' });
  }

  if(errorCache.indexOf(info.errorMessage) === -1) {
    $('#optimizely_error_dialog #optimizely_error_type').append($errorMsgElm);
    $('#optimizely_error_dialog #optimizely_error_info').append($errorIdElm);
    if(errorCache.length === 1) {
      var message = tr('Multiple Account Errors'),
        $messageHeader = $('<h3>').text(message);

      $('#error-modal .modal-body').prepend($messageHeader);
    }
    errorCache.push(info.errorMessage);
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

window.optly.mrkt.errorQ = new ErrorQ({logError: logError});

$(function() {

  checkError();

  if(oldErrorQ.length !== 0) {
    window.optly.mrkt.errorQ.push(oldErrorQ);
  }

});
