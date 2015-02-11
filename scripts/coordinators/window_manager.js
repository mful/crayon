crayon.coordinators || ( crayon.coordinators = {} )

crayon.coordinators.WindowManager = ( function () {
  var activeWindowClass = "crayon-active-window";

  function WindowManager () {
    this.windows = {};
  };

  WindowManager.prototype.handleAddAnnotation = function ( annotation ) {
    var injector;

    if( this.activeWindow && this.activeWindow === this.windows.annotationBubble ) {
      this.showTextEditor({ type: 'comment', id: annotation.attributes.id });
    } else {
      injector = new crayon.services.AnnotationInjector( annotation, crayon.views.AnnotatedTextView );
      return injector.inject();
    }
  }

  WindowManager.prototype.handleMouseup = function ( event ) {
    var keys = Object.keys( this.windows ), i;

    for( i = 0; i < keys.length; i++ ) {
      if ( !this.windows[keys[i]] ) continue;

      if ( event.target === this.windows[keys[i]].element ||
           crayon.helpers.dom.isChildOf(this.windows[keys[i]].element, event.target) )
        return;
    };

    if ( this.windows.annotationBubble ) {
      this.removeWindow( this.windows.annotationBubble );
    }
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

  WindowManager.prototype.removeWindow = function ( view ) {
    if ( !view ) return;

    var keys = Object.keys( this.windows ), i;
    if ( this.activeWindow === view ) this.activeWindow = null;

    for ( i = 0; i < keys.length; i++ ) {
      if ( this.windows[keys[i]] === view ) {
        this.windows[keys[i]].remove()
        this.windows[keys[i]] = null;
        return;
      }
    }
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

    return this.windows.annotationBubble;
  };

  WindowManager.prototype.showCreateWidget = function ( annotation ) {
    if ( !this.windows.createWidget )
      this.windows.createWidget = new crayon.views.AddAnnotationView();

    return this.windows.createWidget.render( annotation );
  };

  WindowManager.prototype.showTextEditor = function ( data ) {
    if ( this.windows.textEditorView ) {
      if (
          this.windows.textEditorView.commentableType === data.type &&
          this.windows.textEditorView.commentableId === data.id
      ) {
        // show v hide?
        return;
      } else {
        this.windows.textEditorView.remove();
      }
    }

    this.windows.textEditorView = new crayon.views.TextEditorWrapperView({
      commentableType: data.type,
      commentableId: data.id
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
