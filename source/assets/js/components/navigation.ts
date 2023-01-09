// Documentation Nav Scroll
$(function () {
  // Vars
  var nav = $('.sl-c-list-navigation-wrapper');
  var sticky = nav.offset();

  // Added sticky class when window top is great than nav top
  function stickyNav() {
    if (
      nav.length > 0 &&
      sticky &&
      ($(window).scrollTop() ?? 0) >= sticky.top
    ) {
      $('.sl-l-medium-holy-grail__body').addClass('sl-js-nav--is-sticky');
    } else {
      $('.sl-l-medium-holy-grail__body').removeClass('sl-js-nav--is-sticky');
    }
  }

  // When scrolling the page, execute stickyNav
  $(window).on('scroll', function () {
    stickyNav();
  });

  return stickyNav();
});
