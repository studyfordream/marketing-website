module.exports = function debug (optionalValue) {
  console.log('Current Context');
  console.log('====================');
   //console.log(this.context);
  if (optionalValue) {
    console.log('Value');
    console.log('====================');
    console.log({val: optionalValue});
  }
};
