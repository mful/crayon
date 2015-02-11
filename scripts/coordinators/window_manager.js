crayon.coordinators || ( crayon.coordinators = {} )

crayon.coordinators.WindowManager = ( function () {
  var activeWindowClass = "crayon-active-window";

  function WindowManager () {
    this.windows = {};
  };

  // TODO: Update spec
  WindowManager.prototype.handleAddAnnotation = function ( data ) {
    var injector, views;

    if ( this.windows.createWidget ) this.windows.createWidget.hide();

    switch ( data.type ) {
      case 'comment':
        this.showTextEditor({type: 'comment', id: data.annotation.attributes.id});
        break;
      case 'annotation':
        injector = new crayon.services.AnnotationInjector( data.annotation, crayon.views.AnnotatedTextView );
        views = injector.inject();
        this.showTextEditor(
          {
            type: 'annotation',
            id: null,
            urlParams: {
              text: data.annotation.attributes.text,
              url: data.annotation.attributes.url
            }
          }
        ,
          {annotatedTextView: views[0]}
        );
        break;
      default:
        injector = new crayon.services.AnnotationInjector( data.annotation, crayon.views.AnnotatedTextView );
        injector.inject();
        break
    }
  };

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

  // Update spec to account for options
  WindowManager.prototype.showTextEditor = function ( data, options ) {
    options || ( options = {} );

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
