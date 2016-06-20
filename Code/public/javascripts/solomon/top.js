$.components.register("mLg", {
  init: function () {

  },
  api: function () {


    /**
     * 语言选择功能初始化
     * BEGIN
     */
    var lis = $('#languageSelect li');

    var currentLg = $.cookie('lg');
    var selectLgBox;
    var selectLgDescribe;
    lis.each(function (i) {
      var li = $('span:first', lis[i]);
      if (li.attr('data-lg') === currentLg) {
        selectLgBox = li;
        selectLgDescribe = $('span:last', lis[i])
      }
    });

    if (selectLgBox != undefined) {
      var currentLgSpan = $('span', $('#currentLg'));
      $(selectLgBox).replaceWith(currentLgSpan.clone());
      $('span', $('#currentLg')).replaceWith(selectLgBox.clone());

      selectLgDescribe.html($('span', $('#currentLg')).attr('data-describe'));
    }
    lis.each(function (key) {
      var li = lis[key];
      $(li).on('click', function () {
        var lg = $('span', this).attr('data-lg');
        $.cookie('lg', lg);
        window.location.reload();
      });
    });
    $('#top-lg-box').show();
    /**
     * END
     */


  }
});