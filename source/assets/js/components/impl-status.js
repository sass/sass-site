$(function () {
  $('.impl-status').each(function () {
    var statusBar = $(this);
    var expandLink = $(this).find('a');
    if (expandLink == null) return;

    var details = $(this).next();
    if (!details.hasClass('sl-c-callout')) return;

    details.hide();
    expandLink.click(function () {
      details.toggle();
      expandLink.toggleClass('expanded');
    });
  });
});
