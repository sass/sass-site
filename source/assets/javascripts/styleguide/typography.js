$(function(){
  $("[class*='font-family']").each(function () {
    $(this).html($(this).css('font-family'))
  });
});
