$(function() {
  $(".sl-c-list-navigation-wrapper--collapsible li > ul")
      .parent()
      .children("a")
      .removeAttr("href")
      .click(function() {
        $(this).toggleClass("open");
        return false;
      });
});
