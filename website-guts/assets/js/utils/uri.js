window.optly.mrkt.utils = window.optly.mrkt.utils || {};

window.optly.mrkt.utils.deparam = $.deparam = function(text) {
  var undef;
  var decode = decodeURIComponent;
  var result = {};

  $.each(text.replace(/\+/g, ' ').split('&'), function(index, pair) {
    var kv = pair.split('=');
    var key = decode(kv[0]);
    if ( !key ) { return; }
    var value = decode(kv[1] || '');
    var keys = key.split('][');
    var last = keys.length - 1;
    var i = 0;
    var current = result;

    if ( keys[0].indexOf('[') >= 0 && /\]$/.test(keys[last]) ) {
      keys[last] = keys[last].replace(/\]$/, '');
      keys = keys.shift().split('[').concat(keys);
      last++;
    } else {
      last = 0;
    }

    if ( last ) {
      for ( ; i <= last; i++ ) {
        key = keys[i] !== '' ? keys[i] : current.length;
        if ( i < last ) {
          current = current[key] = current[key] || (isNaN(keys[i + 1]) ? {} : []);
        } else {
          current[key] = value;
        }
      }
    } else {
      if(/\?/.test(key)) {
        key = key.split('?')[1];
      }
      if ( $.isArray(result[key]) ) {
        result[key].push(value);
      } else if ( key in result ) {
        result[key] = [result[key], value];
      } else {
        result[key] = value;
      }
    }
  });

  return result;
};

window.optly.mrkt.utils.param = function(uri, params, order) {
  this._params = {};

  if (order) {
    $.each(order, function(i, prop) {
      this._params[prop] = params[prop];
    }.bind(this));
  } else {
    $.each(params, function(k, v) {
      this._params[k] = v;
    }.bind(this));
  }

  var paramString = $.param(this._params);

  if (paramString) {
    uri += (uri.indexOf('?') !== -1) ? '&' : '?';
    uri += paramString;
  }

  return uri;
}
