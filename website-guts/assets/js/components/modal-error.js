var DEFAULT_ERROR_MESSAGE = '<t>Don\'t worry, most issues are minor - please refresh your browser and try again.</t>';

function showError(errorMessage, errorId) {
  var info = {
    errorMessage: errorMessage || DEFAULT_ERROR_MESSAGE,
    guid: errorId || window.optly.mrkt.utils.generateGuid(),
    timestamp: window.optly.mrkt.utils.formatDateJson(new Date())
  };

  //TODO if no errorId submit generated GUID to splunk
  //https://github.com/optimizely/optimizely/blob/effa021dfcebdb49ae74ed0982ed0cb99493dbb7/src/www/js/bundle/page.js#L177
  //https://github.com/optimizely/optimizely/blob/devel/src/www/js/bundle/common/errors.js#L90
  $('.optimizely_error').hide();
  $('#optimizely_error_dialog #optimizely_error_type').text(info.errorMessage);
  window.optly.mrkt.modal.open({ modalType: 'error' });
  $('#optimizely_error_dialog #optimizely_error_info').text(info.guid + ' | ' + info.timestamp);
  return info;
}

function checkUrlError () {
  var queryParameters = window.optly.mrkt.utils.deparam(window.location.href);
  if (Object.keys(queryParameters).indexOf('error') !== -1) {
    showError(queryParameters.error, queryParameters.error_id);
  }
}

$(function() {
  checkUrlError();
});
