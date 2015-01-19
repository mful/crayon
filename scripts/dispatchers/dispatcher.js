crayon.dispatchers || ( crayon.dispatchers = {} )

crayon.dispatchers.Dispatcher = ( function () {
  function Dispatcher () {}

  Dispatcher.prototype.dispatch = function ( payload ) {
    var _this = this;

    switch ( payload.message ) {
      case crayon.constants.AnnotationConstants.NEW_ANNOTATION:
        _this.newAnnotation( payload.data );
        break;
      case crayon.constants.UserActionConstants.CLEAR_HIGHLIGHT:
        _this.maybeClearHighlight();
        break;
    }

    return true;
  };

  // check if the annotation form is open. If so, ignore, else hide the widget
  Dispatcher.prototype.maybeClearHighlight = function () {
    // stub
  };

  Dispatcher.prototype.newAnnotation = function ( selection ) {
    crayon.windowManager.showCreateWidget(
      new crayon.models.Annotation( selection )
    );
  };

  return Dispatcher;

})();
