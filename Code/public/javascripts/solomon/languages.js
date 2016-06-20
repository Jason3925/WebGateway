$.components.register("languages", {
  init: function () {
    var _this = this;
    if ($('#currentLg span').attr('data-lg') !== ($.cookie('lg') || 'us') ) {
      $('[name=language-box]').map(function(key, data) {
        $('span:first', data).attr('data-lg') === ($.cookie('lg') || 'us') && _this.change(data);
      });
    }
    $('[name=language-box]').on('click', function() {
      $.cookie('lg', $('span:first', this).attr('data-lg'));
      window.location.reload();
    });
    $('#languages-box').show();
  },
  api: function () {

  },
  change : function(content) {
    var icon = $('span:first', content),
      text = $('span:last', content),
      curA = $('#currentLg');
    var curS = new $('span', curA);
    curA.html(icon.clone());
    icon.replaceWith(curS);
    text.html(curS.attr('data-describe'));
  }
});