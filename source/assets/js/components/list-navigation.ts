$(function () {
  $('.sl-c-list-navigation-wrapper--collapsible li > ul')
    .parent()
    .children('a')
    .on('click', function () {
      $(this).toggleClass('open');
      return false;
    });
});
