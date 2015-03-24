$('.js-category-cta').on('click', function(event) {
  var category = $(this).data('category');
  console.log(category);
  $('#Field1').val(category);
  w.optly.mrkt.utils.smoothScroll.apply(this, [event]);
});
