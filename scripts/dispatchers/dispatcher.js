crayon.dispatchers || ( crayon.dispatchers = {} )

crayon.dispatchers.Dispatcher = ( function () {
  function Dispatcher () {}

  Dispatcher.prototype.dispatch = function ( payload ) {
    var _this = this;

    switch ( payload.message ) {
      case crayon.constants.AnnotationConstants.CANCEL_ANNOTATION:
        _this.cancelAnnotation();
        break;
      case crayon.constants.AppConstants.READY:
        _this.initializePage();
        break;
      case crayon.constants.AnnotationConstants.NEW_ANNOTATION:
        _this.newAnnotation( payload.data );
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
      case crayon.constants.NotificationConstants.REPLY_NOTIFICATION:
        _this.handleReplyNotification( payload.data );
        break;
      case crayon.constants.SessionConstants.AUTH_NEEDED:
        _this.promptAuth( payload.data );
        break;
      case crayon.constants.UserActionConstants.CLEAR_HIGHLIGHT:
        _this.maybeClearHighlight();
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
    if ( !!annotation.attributes.id ) {
      this.newComment( annotation.attributes.id );
    } else {
      crayon.windowManager.handleAddNewAnnotation( annotation );
    }
  };

  Dispatcher.prototype.cancelAnnotation = function () {
    crayon.annotatedTextManager.removeActiveIfUnpersisted();
  };

  Dispatcher.prototype.initializePage = function ( annotation ) {
    return new crayon.services.PageInitializer().go();
  };

  Dispatcher.prototype.handleCreateAnnotation = function ( annotation ) {
    var model = new crayon.models.Annotation( annotation );
    return crayon.windowManager.handleCreateAnnotation( model );
  };

  Dispatcher.prototype.handleReplyNotification = function ( params ) {
    return crayon.windowManager.showReply( params );
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
    crayon.windowManager.showTextEditor({ type: 'comment', id: annotationId });
  };

  Dispatcher.prototype.notifyLogin = function ( data ) {
    crayon.windowManager.removeWindow( crayon.windowManager.windows.authView );

    return crayon.windowManager.messageWindows(
      crayon.constants.CourierConstants.POST_LOGIN,
      data
    );
  };

  Dispatcher.prototype.notifyCreateComment = function ( data ) {
    crayon.windowManager.handleCreateComment( data )
  };

  Dispatcher.prototype.promptAuth = function ( data ) {
    crayon.windowManager.showAuth( data.referringAction );
  };

  Dispatcher.prototype.removeWindow = function ( view ) {
    crayon.windowManager.removeWindow( view );
  };

  Dispatcher.prototype.showComments = function ( data ) {
    return crayon.windowManager.showSidebar(
      data.annotation,
      crayon.helpers.routes.annotation_url( data.annotation.attributes.id )
    );
  };

  return Dispatcher;

})();
