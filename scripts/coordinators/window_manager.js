crayon.coordinators || ( crayon.coordinators = {} )

crayon.coordinators.WindowManager = ( function () {
  var activeWindowClass = "crayon-active-window";

  function WindowManager () {
    this.windows = {};
  };

  WindowManager.prototype.handleAddNewAnnotation = function ( annotation ) {
    var errors, url;

    if ( !annotation.isValid() ) {
      errors = annotation.errors.join("\n- ");
      alert( ":( We can't annotate the highlighted text.\n\n- " + errors );
      return;
    }

    url = crayon.helpers.routes.new_annotation_url({
      text: annotation.attributes.text,
      url: annotation.attributes.url
    })

    crayon.annotatedTextManager.injectAnnotation( annotation );
    this.showSidebar( annotation, url );
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
    crayon.annotatedTextManager.persistActiveAnnotation( annotation );
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
        break;
      }
    }

    if ( !this.windows.sidebar ) {
      crayon.annotatedTextManager.deactivateAnnotations();
    } else if ( !this.activeWindow ) {
      this.setActive( this.windows.sidebar );
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

  WindowManager.prototype.showCreateWidget = function ( annotation ) {
    var pad;

    if ( !this.windows.createWidget )
      this.windows.createWidget = new crayon.views.AddAnnotationView();

    pad = this.windows.sidebar ? this.windows.sidebar.element.clientWidth : 0;

    return this.windows.createWidget.render( annotation, pad );
  };

  WindowManager.prototype.showReply = function ( params ) {
    var url =
          crayon.helpers.routes.comment_url( params.cryn_cid, { reply_id: params.cryn_id } ),
        annotation = crayon.annotatedTextManager.getAnnotationById( params.cryn_aid )

    return this.showSidebar( annotation, url );
  };

  WindowManager.prototype.showSidebar = function ( annotation, url ) {
    if ( !this.windows.sidebar )
      this.windows.sidebar = new crayon.views.SidebarWrapperView();

    this.setActive( this.windows.sidebar );
    this.windows.sidebar.render( url );
    crayon.annotatedTextManager.activateAnnotation( annotation );
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
