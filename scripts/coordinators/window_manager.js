crayon.coordinators || ( crayon.coordinators = {} )

crayon.coordinators.WindowManager = ( function () {

  function WindowManager () {
    this.windows = {};
  };

  WindowManager.prototype.maybeHideWidget = function () {
    if ( !this.windows.createWidget ) return null;

    // TODO: add check for widget activeness before hiding
    return this.windows.createWidget.hide();
  };

  WindowManager.prototype.showCreateWidget = function ( annotation ) {
    if ( !this.windows.createWidget )
      this.windows.createWidget = new crayon.views.AddAnnotationView();

    return this.windows.createWidget.render( annotation );
  };

  return WindowManager
})();
