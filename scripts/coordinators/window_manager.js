crayon.coordinators || ( crayon.coordinators = {} )

crayon.coordinators.WindowManager = ( function () {
  var activeWindowClass = "crayon-active-window";

  function WindowManager () {
    this.windows = {};
  };

  WindowManager.prototype.handleAddNewAnnotation = function ( annotation ) {
    var errors, views;

    if ( !annotation.isValid() ) {
      errors = annotation.errors.join("\n- ");
      alert( ":( We can't annotate the highlighted text.\n\n- " + errors );
      return;
    }


    views = crayon.annotatedTextManager.injectAnnotation( annotation );
    this.showTextEditor(
      {
        type: 'annotation',
        id: null,
        urlParams: {
          text: annotation.attributes.text,
          url: annotation.attributes.url
        }
      }
    ,
      {annotatedTextView: views[0]}
    );

    crayon.annotatedTextManager.activateAnnotation( annotation );
  };

  // TODO: add spec
  WindowManager.prototype.handleCreateComment = function ( data ) {
    this.removeWindow( crayon.windowManager.windows.textEditorView );
    if ( !this.windows.sidebar && !data.comment.annotation_id ) {
      this.showRepliesSidebar( data.comment.parent_comment_id )
    }

    return crayon.windowManager.messageWindows(
      crayon.constants.CourierConstants.POST_CREATE_COMMENT,
      data
    );
  }

  // TODO: add spec
  WindowManager.prototype.handleCreateAnnotation = function ( annotation ) {
    var highlightView = this.windows.textEditorView.annotatedTextView;
    highlightView.model = annotation;

    this.removeWindow( this.windows.textEditorView );

    return this.showCommentsBubble({
      element: highlightView.elements[0],
      view: highlightView,
      annotation: annotation
    });
  };

  WindowManager.prototype.handleMouseup = function ( event ) {
    var keys = Object.keys( this.windows ), i;

    for( i = 0; i < keys.length; i++ ) {
      if ( !this.windows[keys[i]] ) continue;

      if ( event.target === this.windows[keys[i]].element ||
           crayon.helpers.dom.isChildOf(this.windows[keys[i]].element, event.target) )
        return;
    };

    if ( this.windows.annotationBubble )
      this.removeWindow( this.windows.annotationBubble );

    if ( this.windows.sidebar )
      this.removeWindow( this.windows.sidebar );
  };

  WindowManager.prototype.maybeHideWidget = function () {
    if (
        !this.windows.createWidget ||
        ( this.activeWindow && this.activeWindow === this.windows.annotationBubble )
    ) return null;

    // TODO: add check for widget activeness before hiding
    return this.windows.createWidget.hide();
  };

  WindowManager.prototype.messageWindows = function ( message, data ) {
    var contentWindows = this._getContentWindows(), i;

    for ( i = 0; i < contentWindows.length; i++ ) {
      crayon.courier.post( contentWindows[i], message, data );
    }
  };

  WindowManager.prototype.rearrangeWindows = function ( target ) {
    switch ( target ) {
      case 'paper':
        this.setActive( this.windows.textEditorView );
        break;
      case 'bubble':
        this.setActive( this.windows.annotationBubble );
        break;
      case 'retort':
        this.setActive( this.windows.sidebar );
        break;
    }

    return target;
  };

  WindowManager.prototype.removeWindow = function ( view ) {
    if ( !view ) return;

    var keys = Object.keys( this.windows ), i;
    if ( this.activeWindow === view ) this.activeWindow = null;


    for ( i = 0; i < keys.length; i++ ) {
      if ( this.windows[keys[i]] === view ) {
        this.windows[keys[i]].remove()
        this.windows[keys[i]] = null;
        break;
      }
    }

    if ( !this.windows.annotationBubble && !this.windows.textEditorView )
        crayon.annotatedTextManager.deactivateAnnotations();
  };

  WindowManager.prototype.showAuth = function ( referringAction ) {
    if ( this.windows.authView ) {
      this.windows.authView.remove();
      this.windows.authView = null;
    }

    this.windows.authView =
      new crayon.views.AuthWrapperView();

    this.setActive( this.windows.authView );

    return this.windows.authView.render( referringAction );
  };

  WindowManager.prototype.showCommentsBubble = function ( data ) {
    if ( this.windows.annotationBubble ) {
      this.windows.annotationBubble.remove();
      this.windows.annotationBubble = null;
    }

    this.windows.annotationBubble =
      new crayon.views.AnnotationBubbleWrapperView( data ).render();

    this.setActive( this.windows.annotationBubble );
    crayon.annotatedTextManager.activateAnnotation( data.annotation );

    return this.windows.annotationBubble;
  };

  WindowManager.prototype.showCreateWidget = function ( annotation ) {
    if ( !this.windows.createWidget )
      this.windows.createWidget = new crayon.views.AddAnnotationView();

    return this.windows.createWidget.render( annotation );
  };

  WindowManager.prototype.showRepliesSidebar = function ( commentId ) {
    if ( this.windows.sidebar ) this.removeWindow( this.windows.sidebar );

    this.windows.sidebar = new crayon.views.SidebarWrapperView({ commentId: commentId });
    this.setActive( this.windows.sidebar );

    return this.windows.sidebar.render();
  };

  // Update spec to account for options
  WindowManager.prototype.showTextEditor = function ( data, options ) {
    options || ( options = {} );

    if ( this.windows.createWidget ) this.windows.createWidget.hide();

    if ( this.windows.textEditorView ) {
      if (
          this.windows.textEditorView.commentableType === data.type &&
          this.windows.textEditorView.commentableId === data.id
      ) {
        return;
      } else {
        this.windows.textEditorView.remove();
      }
    }

    this.windows.textEditorView = new crayon.views.TextEditorWrapperView({
      commentableType: data.type,
      commentableId: data.id,
      urlParams: data.urlParams,
      annotatedTextView: options.annotatedTextView
    });

    this.setActive( this.windows.textEditorView );

    return this.windows.textEditorView.render();
  };

  WindowManager.prototype.setActive = function ( view ) {
    if ( this.activeWindow )
      crayon.helpers.utility.removeClass( this.activeWindow.element, activeWindowClass );

    this.activeWindow = view;
    crayon.helpers.utility.addClass( this.activeWindow.element, activeWindowClass );
  };

  // private

  WindowManager.prototype._getContentWindows = function () {
    var keys = Object.keys( this.windows ),
        windows = [],
        i;

    for ( i = 0; i < keys.length; i ++ ) {
      if ( !this.windows[keys[i]] || !this.windows[keys[i]].iframe ) continue;
      windows.push( this.windows[keys[i]].iframe.contentWindow );
    }

    return windows;
  };

  return WindowManager;

})();
