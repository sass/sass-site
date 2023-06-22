$(() => {
  $('.impl-status').each(function () {
    const statusBar = $(this);
    const expandLink = statusBar.find('a');
    // eslint-disable-next-line eqeqeq
    if (expandLink == null) {
      return;
    }

    const details = statusBar.next();
    if (!details.hasClass('sl-c-callout')) {
      return;
    }

    details.hide();
    expandLink.on('click', () => {
      details.toggle();
      expandLink.toggleClass('expanded');
    });
  });
});
