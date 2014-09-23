window.optly.mrkt.utils = window.optly.mrkt.utils || {};

window.optly.mrkt.utils.checkComplexPassword = function(password) {
  var CHAR_LOWERS = /[a-z]/,
    CHAR_UPPERS   = /[A-Z]/,
    CHAR_NUMBERS  = /[0-9]/,
    CHAR_SPECIAL  = /[?=.*!@#$%^&*]/,
    CHAR_TYPES    = [CHAR_LOWERS,CHAR_UPPERS,CHAR_NUMBERS,CHAR_SPECIAL],
    counter       = 4;

  for (var i=0; i<CHAR_TYPES.length; i++){
    if(!CHAR_TYPES[i].test(password)){
      counter--;
    }
  }

  if (counter <= 1 || password.length < 8){
    return false;
  } else {
    return true;
  }
};

