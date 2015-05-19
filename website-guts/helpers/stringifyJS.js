module.exports = function(key) {
  return JSON.stringify(this.context[key]);
};
