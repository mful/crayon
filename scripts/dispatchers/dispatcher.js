crayon.dispatchers || ( crayon.dispatchers = {} )

crayon.dispatchers.Dispatcher = ( function () {
  function Dispatcher () {}

  Dispatcher.prototype.dispatch = function ( payload ) {
    var _this = this;

    switch ( payload.message ) {
      case crayon.constants.AppConstants.READY:
        _this.fetchPageAnnotations();
        break;
      case crayon.constants.AnnotationConstants.NEW_ANNOTATION:
        _this.newAnnotation( payload.data );
        break;
      case crayon.constants.CommentConstants.SHOW_COMMENTS:
        _this.showComments( payload.data );
        break;
      case crayon.constants.UserActionConstants.CLEAR_HIGHLIGHT:
        _this.maybeClearHighlight();
        break;
      case crayon.constants.UserActionConstants.MOUSEUP:
        _this.manageWindows( payload.data );
        break;
      case crayon.constants.AnnotationConstants.ADD_ANNOTATION:
        _this.addAnnotation( payload.data );
        break;
    }

    return true;
  };

  Dispatcher.prototype.addAnnotation = function ( annotation ) {
    var injector = new crayon.services.AnnotationInjector( annotation, crayon.views.AnnotatedTextView );
    return injector.inject();
  };

  Dispatcher.prototype.fetchPageAnnotations = function ( annotation ) {
    var _this = this;

    return crayon.models.Annotation.fetchAllForPage(
      crayon.helpers.url.currentHref(),
      function ( annotations ) {

        for ( i = 0; i < annotations.length; i++ ) {
          _this.addAnnotation( annotations[i] );
        }

        return annotations;
      }
    )
  };

  Dispatcher.prototype.manageWindows = function ( event ) {
    return crayon.windowManager.handleMouseup( event );
  };

  Dispatcher.prototype.maybeClearHighlight = function () {
    return crayon.windowManager.maybeHideWidget();
  };

  Dispatcher.prototype.newAnnotation = function ( selection ) {
    crayon.windowManager.showCreateWidget(
      crayon.models.Annotation.createFromSelection( selection )
    );
  };

  Dispatcher.prototype.showComments = function ( data ) {
    return crayon.windowManager.showCommentsBubble( data );
  };

  return Dispatcher;

})();
