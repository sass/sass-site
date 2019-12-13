$(function() {
  $(".sl-c-list-navigation-wrapper--collapsible li > ul")
      .parent()
      .children("a")
      // .removeAttr("href") Remove attr was causing keyboard focus skips
      .click(function() {
        $(this).toggleClass("open");
        return false;
      });
});
