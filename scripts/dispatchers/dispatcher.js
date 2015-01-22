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
      case crayon.constants.AnnotationConstants.ADD_ANNOTATION:
        _this.addAnnotation( payload.data );
        break;
    }

    return true;
  };

  Dispatcher.prototype.addAnnotation = function ( annotation ) {
    var textView = new crayon.views.AnnotatedTextView( annotation );
    return textView.render();
  };

  Dispatcher.prototype.maybeClearHighlight = function () {
    return crayon.windowManager.maybeHideWidget();
  };

  Dispatcher.prototype.newAnnotation = function ( selection ) {
    crayon.windowManager.showCreateWidget(
      new crayon.models.Annotation( selection )
    );
  };

  return Dispatcher;

})();
