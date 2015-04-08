module.exports = function classgridstart (index, rowCount, options)  {
  if (index === 0 || index % rowCount === 0) {
      return options.fn(this);
  }
  return options.inverse(this);
};
