// Documentation Nav Scroll
(function docNav() {
  // Vars
  var nav = $(".sl-c-list-navigation-wrapper");
  var sticky = nav.offset();

  // Added sticky class when window top is great than nav top
  function stickyNav() {
    if ( nav.length > 0 && $(window).scrollTop() >= sticky.top) {
      $(".sl-l-medium-holy-grail__body").addClass("sl-js-nav--is-sticky");
    } else {
      $(".sl-l-medium-holy-grail__body").removeClass("sl-js-nav--is-sticky");
    }
  }

    // When scrolling the page, execute stickyNav
    $(window).scroll(function() {
      stickyNav();
    });

  return stickyNav();
})();
