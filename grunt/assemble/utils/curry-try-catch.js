module.exports = function curryTryCatch(fn) {
  var name = fn.name;

  return function(){
    try {
      return fn.apply(fn, arguments);
    } catch(error) {
      throw new Error('Function Name: ' + name +  error);
    }
  };
};
