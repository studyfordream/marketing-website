module.exports = {
  cssSourceMap: {
    src: '<%= config.temp %>/css/styles.css.map',
    overwrite: true,
    replacements: [
      {
        from: 'website-guts/',
        to: '../../../website-guts/'
      }
    ]
  }
};
