$(document).keydown(function(event) {
  // We aren't interested in any modified keys.
  if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  // Forward slash or "s" focus the search bar.
  if ((event.which == 191 || event.which == 83) &&
      event.target.tagName !== "INPUT") {
    $("input.search").focus();
    event.preventDefault();
  }
});
