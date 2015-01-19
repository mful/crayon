crayon.coordinators || ( crayon.coordinators = {} )

crayon.coordinators.WindowManager = ( function () {

  function WindowManager () {
    this.windows = {};
  };

  WindowManager.prototype.showCreateWidget = function ( annotation ) {
    if ( !this.windows.createWidget )
      this.windows.createWidget = new crayon.views.WidgetView();

    return this.windows.createWidget.render( annotation );
  };

  return WindowManager
})();
