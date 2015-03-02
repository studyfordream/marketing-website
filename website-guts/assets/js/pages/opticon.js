var urlParams = window.optly.mrkt.utils.deparam(window.location.search);

if (!$.isEmptyObject(urlParams)) {
  var replacementHref = window.optly.mrkt.utils.param('https://opticon2015.eventbrite.com/?ref=elink', urlParams);
  $('#register .cta').attr('href', replacementHref);
}

$('[smooth-scroll]').on('click', w.optly.mrkt.utils.smoothScroll);