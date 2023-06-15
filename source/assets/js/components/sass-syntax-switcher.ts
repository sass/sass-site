$(function () {
  $('.code-example').each(function () {
    const figure = $(this);

    figure.tabs({
      active: 0,
      beforeActivate: function (event, ui) {
        // If multiple panels are visible, the CSS tab shouldn't be clickable.
        return !(
          ui.newPanel.hasClass('css') && allPanels.filter(':visible').length > 1
        );
      },
      activate: function (event, ui) {
        if (ui.newPanel.hasClass('css')) {
          figure.addClass('ui-tabs-panel-css-is-active');
        } else {
          figure.removeClass('ui-tabs-panel-css-is-active');
        }

        allPanels.removeClass('ui-tabs-panel-previously-active');
        ui.oldPanel
          .addClass('ui-tabs-panel-inactive')
          .addClass('ui-tabs-panel-previously-active');
        ui.newPanel.removeClass('ui-tabs-panel-inactive');
        allPanels.css('display', '');
      },
    });
    const allPanels = figure.find('.ui-tabs-panel');
    allPanels.css('display', '');
  });

  // Switch ALL the tabs (Sass/SCSS) together
  let noRecursion = false;
  const jqA = $('a.ui-tabs-anchor'),
    jqASass = jqA.filter(":contains('Sass')").on('click', function () {
      if (!noRecursion) {
        noRecursion = true;
        jqASass.not(this).trigger('click');
        noRecursion = false;
      }
    }),
    jqASCSS = jqA.filter(":contains('SCSS')").on('click', function () {
      if (!noRecursion) {
        noRecursion = true;
        jqASCSS.not(this).trigger('click');
        noRecursion = false;
      }
    });
});
