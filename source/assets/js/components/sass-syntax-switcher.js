$(function() {
  // Initialize the tabs (Sass/SCSS) with jQuery-ui
  $( ".slides ul" ).parent().tabs();

  // Hover states on the static widgets
  $( "#dialog-link, #icons li" ).hover(
    function() {
      $( this ).addClass( "ui-state-hover" );
    },
    function() {
      $( this ).removeClass( "ui-state-hover" );
    }
  );

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
