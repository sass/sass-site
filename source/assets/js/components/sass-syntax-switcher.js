$(function() {
  $(".code-example").each(function() {
    var figure = $(this);
    var id = figure.attr("data-unique-id");

    figure
      .prepend(
        $("<ul></ul>")
          .prepend("<li><a href='#example-" + id + "-sass'>Sass</a></li>")
          .prepend("<li><a href='#example-" + id + "-scss'>SCSS</a></li>"))
      .tabs({active: 2});
  });

  // Switch ALL the tabs (Sass/SCSS) together
  var
    noRecursion = false,
    jqA = $( "a.ui-tabs-anchor" ),
    jqASass = jqA.filter( ":contains('Sass')" ).click(function() {
      if ( !noRecursion ) {
        noRecursion = true;
        jqASass.not( this ).click();
        noRecursion = false;
      }
    }),
    jqASCSS = jqA.filter( ":contains('SCSS')" ).click(function() {
      if ( !noRecursion ) {
        noRecursion = true;
        jqASCSS.not( this ).click();
        noRecursion = false;
      }
    })
  ;
});
