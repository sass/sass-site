$(function () {
  $('.impl-status').each(function () {
    var statusBar = $(this);
    var expandLink = statusBar.find('a');
    if (expandLink == null) return;

    var details = statusBar.next();
    if (!details.hasClass('sl-c-callout')) return;

    details.hide();
    expandLink.on('click', function () {
      details.toggle();
      expandLink.toggleClass('expanded');
    });
  });
});
