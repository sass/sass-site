$(".progress").wrapInner("<div class='progress-wrap'><div class='progress-center'><div class='progress-bar'></div></div></div>");

for (var i = 0; i < 8; i++) {
  $(".progress-bar").append("<div class='progress-block'></div>");
}
