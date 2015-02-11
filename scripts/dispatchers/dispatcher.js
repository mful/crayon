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
      case crayon.constants.CommentConstants.CANCEL_COMMENT:
        _this.handleCancelComment( payload.data.view );
        break;
      case crayon.constants.CommentConstants.NEW_COMMENT:
        _this.newComment( payload.data.annotation_id );
        break;
      case crayon.constants.CommentConstants.SHOW_COMMENTS:
        _this.showComments( payload.data );
        break;
      case crayon.constants.CourierConstants.POST_LOGIN:
        _this.notifyLogin( payload.data );
        break;
      case crayon.constants.CourierConstants.POST_CREATE_ANNOTATION:
        _this.handleCreateAnnotation( payload.data.annotation );
        break;
      case crayon.constants.CourierConstants.POST_CREATE_COMMENT:
        _this.notifyCreateComment( payload.data );
        break;
      case crayon.constants.SessionConstants.AUTH_NEEDED:
        _this.promptAuth( payload.data );
        break;
      case crayon.constants.UserActionConstants.CLEAR_HIGHLIGHT:
        _this.maybeClearHighlight();
        break;
      case crayon.constants.UserActionConstants.MOUSEUP:
        _this.manageWindows( payload.data );
        break;
      case crayon.constants.AnnotationConstants.ADD_ANNOTATION:
        _this.addNewAnnotation( payload.data );
        break;
      case crayon.constants.WindowConstants.REMOVE_WINDOW:
        _this.removeWindow( payload.data.view );
        break;
    }

    return true;
  };

  Dispatcher.prototype.addNewAnnotation = function ( annotation ) {
    var type = !!annotation.attributes.id ? 'comment' : 'annotation';
    crayon.windowManager.handleAddAnnotation({ annotation: annotation, type: type });
  };

  Dispatcher.prototype.fetchPageAnnotations = function ( annotation ) {
    var _this = this;

    return crayon.models.Annotation.fetchAllForPage(
      crayon.helpers.url.currentHref(),
      function ( annotations ) {

        for ( i = 0; i < annotations.length; i++ ) {
          crayon.windowManager.handleAddAnnotation({ annotation: annotations[i] });
        }

        return annotations;
      }
    )
  };

  // TODO: add spec or move to windowManager and add spec thereg
  Dispatcher.prototype.handleCancelComment = function ( view ) {
    if ( view.annotatedTextView && !view.annotatedTextView.model.attributes.id )
        view.annotatedTextView.remove();
    return this.removeWindow( view );
  };

  Dispatcher.prototype.handleCreateAnnotation = function ( annotation ) {
    var model = new crayon.models.Annotation( annotation );
    return crayon.windowManager.handleCreateAnnotation( model );
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

  Dispatcher.prototype.newComment = function ( annotationId ) {
    crayon.windowManager.handleAddAnnotation({ type: 'comment', annotation: {attributes: {id: annotationId}} });
  };

  Dispatcher.prototype.notifyLogin = function ( data ) {
    crayon.windowManager.removeWindow( crayon.windowManager.windows.authView );

    return crayon.windowManager.messageWindows(
      crayon.constants.CourierConstants.POST_LOGIN,
      data
    );
  };

  Dispatcher.prototype.notifyCreateComment = function ( data ) {
    crayon.windowManager.removeWindow( crayon.windowManager.windows.textEditorView );

    return crayon.windowManager.messageWindows(
      crayon.constants.CourierConstants.POST_CREATE_COMMENT,
      data
    );
  };

  Dispatcher.prototype.promptAuth = function ( data ) {
    crayon.windowManager.showAuth( data.referringAction );
  };

  Dispatcher.prototype.removeWindow = function ( view ) {
    crayon.windowManager.removeWindow( view );
  };

  Dispatcher.prototype.showComments = function ( data ) {
    crayon.windowManager.showCreateWidget( data.annotation );
    return crayon.windowManager.showCommentsBubble( data );
  };

  return Dispatcher;

})();
