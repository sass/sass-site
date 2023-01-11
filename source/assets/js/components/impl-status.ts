$(function () {
  $('.impl-status').each(function () {
    const statusBar = $(this);
    const expandLink = statusBar.find('a');
    if (expandLink == null) return;

    const details = statusBar.next();
    if (!details.hasClass('sl-c-callout')) return;

    details.hide();
    expandLink.on('click', function () {
      details.toggle();
      expandLink.toggleClass('expanded');
    });
  });
});
