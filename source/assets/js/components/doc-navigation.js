// Documentation Nav Scroll
(function docNav() {
  // Vars
  var nav = $(".sl-c-list-navigation-wrapper");
  var sticky = nav.offset();

  // Added sticky class when window top is great than nav top
  function stickyNav() {
    if ($(window).scrollTop() >= sticky.top) {
      $('.sl-l-medium-holy-grail__body').addClass('nav--is-sticky');
    } else {
      $('.sl-l-medium-holy-grail__body').removeClass('nav--is-sticky');
    }
  }

    // When scrolling the page, execute stickyNav
    $(window).scroll(function() {
      stickyNav();
    });

  return stickyNav();
})();