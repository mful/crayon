describe( 'crayon.coordinators.WindowManager', function () {

  beforeEach( function () {
    this.coordinator = new crayon.coordinators.WindowManager();
    crayon.annotatedTextManager = new crayon.coordinators.AnnotatedTextManager();
  });

  afterEach( function () {
    delete this.coordinator;
  });

  describe( '#handleAddAnnotation', function () {

    beforeEach( function () {
      spyOn( this.coordinator, 'showTextEditor' )
    });

    describe( 'when there is an active annotation bubble', function () {

      beforeEach( function () {
        var activeWindow = {},
            annotation = {attributes: {id: 1}};
        this.coordinator.activeWindow = activeWindow;
        this.coordinator.windows.annotationBubble = activeWindow;

        this.coordinator.handleAddAnnotation({ annotation: annotation, type: 'comment' })
      });

      it( 'should open the text editor', function () {
        expect( this.coordinator.showTextEditor ).toHaveBeenCalled();
      });
    });

    describe( 'when needing to create a new annotation', function () {
      // stub
    });
  });

  describe( '#handleMouseup', function () {
    describe( 'when there is an active annotation bubble', function () {

      beforeEach( function () {
        var view = {};

        this.view = new crayon.views.AnnotationBubbleWrapperView({
          element: document.createElement( 'div' ),
          annotation: new crayon.models.Annotation({ id: 1 }),
          view: view
        });

        this.coordinator.windows.annotationBubble = this.view;

        spyOn( this.view, 'remove' );
      });

      afterEach( function () {
        delete this.view;
      });

      describe( 'when the mouseup occurs outside of a crayon view', function () {

        beforeEach( function () {
          this.coordinator.handleMouseup({ target: document.createElement('div') });
        });

        it( 'should close the bubble, and null out the reference', function () {
          expect( this.view.remove ).toHaveBeenCalled();
        });

        it( 'should null out the reference', function () {
          expect( this.coordinator.windows.annotationBubble === null ).toEqual( true );
        });
      });

      describe( 'when the mouseup occurs on a crayon view element', function () {

        beforeEach( function () {
          this.coordinator.handleMouseup({target: this.coordinator.windows.annotationBubble.element})
        });

        it( 'should do nothing', function () {
          expect( this.view.remove ).not.toHaveBeenCalled();
        });
      });

      describe( 'when the mouseup occurs on a child element of a crayon view element', function () {

        beforeEach( function () {
          var el = document.createElement( 'div' ),
              child = document.createElement( 'span' );

          el.appendChild( child );
          this.coordinator.windows.annotationBubble.element.appendChild( el );

          this.coordinator.handleMouseup({target: child})
        });

        it( 'should do nothing', function () {
          expect( this.view.remove ).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe( '#maybeHideWidget', function () {
    describe( 'when the AddAnnotation widget exists', function () {

      beforeEach( function () {
        this.view = new crayon.views.AddAnnotationView();
        this.view.render();
        this.coordinator.windows.createWidget = this.view;
        this.coordinator.maybeHideWidget();
      });

      afterEach( function () {
        delete this.coordinator.windows.createWidget;
      });

      it( 'should hide the view', function () {
        expect( /(?:^|\s)hidden(?!\S)/.test( this.view.element.className ) ).toEqual( true )
      })
    });

    describe( 'when the AddAnnotation widget does not exist', function () {
      it( 'should return null', function () {
        expect( this.coordinator.maybeHideWidget() ).toEqual( null );
      });
    });

    describe( 'and there is an active annotation bubble', function () {

      beforeEach( function () {
        var activeWindow = {};
        this.coordinator.activeWindow = activeWindow;
        this.coordinator.windows.annotationBubble = activeWindow;
      });

      it( 'should return null', function () {
        expect( this.coordinator.maybeHideWidget() ).toEqual( null );
      });
    });
  });

  describe( '#messageWindows', function () {

    beforeEach( function () {
      crayon.courier = {post: function (msg, data) {}}

      this.coordinator.windows = [{iframe: {contentWindow: {}}},null,{iframe: {contentWindow: {}}}, {}];
      spyOn( crayon.courier, 'post' );

      this.coordinator.messageWindows( 'message', {} );
    });

    afterEach( function () {
      delete crayon.courier;
    });

    it( 'should post a message to each window with an iframe', function () {
      expect( crayon.courier.post.calls.count() ).toEqual(2);
    });
  });

  describe( '#removeWindow', function () {

    beforeEach( function () {
      this.view = {remove: function () {}};
      this.coordinator.activeWindow = this.view;
      this.coordinator.windows.annotationBubble = this.view;

      spyOn( this.view, 'remove' );
      spyOn( crayon.annotatedTextManager, 'deactivateAnnotations' );
    });

    describe( 'when its the only window open', function () {
      beforeEach( function () {
        this.coordinator.removeWindow( this.view );
      });

      it( 'should null out the active window', function () {
        expect( this.coordinator.activeWindow ).toEqual( null );
      });

      it( 'should remove the view', function () {
        expect( this.view.remove ).toHaveBeenCalled();
      });

      it( 'should null out the reference to the window in window manager', function () {
        expect( this.coordinator.windows.annotationBubble ).toEqual(  null );
      });

      it( 'should deactivate annotations', function () {
        expect( crayon.annotatedTextManager.deactivateAnnotations ).toHaveBeenCalled();
      });
    })

    describe( 'when there are other windows', function () {

      beforeEach( function () {
        this.coordinator.windows.textEditorView = {};
      });
    });

    it( 'should not deactivate annotations a relevant window is active', function () {
      expect( crayon.annotatedTextManager.deactivateAnnotations ).not.toHaveBeenCalled();
    });
  });

  describe( '#showAuth', function () {

    beforeEach( function () {
      this.oldView = {remove: function () {}};
      this.coordinator.windows.authView = this.oldView;

      this.newView = {render: function () {}, element: document.createElement( 'div' )};

      spyOn( crayon.views, 'AuthWrapperView' ).and.returnValue( this.newView );
      spyOn( this.oldView, 'remove' );

      this.coordinator.showAuth( 'vote' );
    });

    afterEach( function () {
      delete this.oldView;
      delete this.newView;
    });

    it( 'should remove the current authView', function () {
      expect( this.oldView.remove ).toHaveBeenCalled();
    });

    it( 'should set a new authView', function () {
      expect( this.coordinator.windows.authView ).toEqual( this.newView );
    });

    it( 'should set the new authView as active', function () {
      expect( this.coordinator.activeWindow ).toEqual( this.newView );
    });
  });

  describe( '#showCommentsBubble', function () {
    describe( 'when there already is an active bubble', function () {
      beforeEach( function () {
        this.childView = {render: function () {return this;}, element: document.createElement( 'div' )};
        var data = {
          element: document.createElement( 'div' ),
          annotation: new crayon.models.Annotation({ id: 1 }),
          view: this.childView
        };
        this.view = {remove: function () {}};
        this.coordinator.windows.annotationBubble = this.view;

        spyOn( crayon.views, 'AnnotationBubbleWrapperView' ).and.returnValue( this.childView );
        spyOn( this.view, 'remove' );
        spyOn( this.childView, 'render' ).and.returnValue( this.childView );
        spyOn( crayon.annotatedTextManager, 'activateAnnotation' );

        this.coordinator.showCommentsBubble( data );
      });

      afterEach( function () {
        delete this.view;
        delete this.childView;
      });

      it( 'should remove the old view', function () {
        expect( this.view.remove ).toHaveBeenCalled();
      });

      it( 'should render a new view', function () {
        expect( this.childView.render ).toHaveBeenCalled();
      });

      it( 'should set the new view as the active window', function () {
        expect( this.childView ).toEqual( this.coordinator.activeWindow );
      });

      it( 'should activate the annotation', function () {
        expect( crayon.annotatedTextManager.activateAnnotation ).toHaveBeenCalled();
      });
    });
  });

  describe( '#showCreateWidget', function () {
    beforeEach( function () {
      this.annotation = crayon.models.Annotation.createFromSelection({
        rangeCount: 1,
        getRangeAt: function ( i ){
          return {
            commonAncestorContainer: { textContent: ' We are not descended from fearful men.   ' }
          };
        }
      });
    });

    afterEach( function () {
      delete this.annotation;
    });

    describe( 'when the AddAnnotation widget has not yet been created', function () {
      beforeEach( function () {
        this.coordinator.showCreateWidget( this.annotation );
      });

      it( 'should create the view', function () {
        this.coordinator.windows.createWidget !== null && this.coordinator.windows.createWidget !== undefined
      });

      it( 'show the view', function () {
        expect( /(?:^|\s)hidden(?!\S)/.test( this.coordinator.windows.createWidget.element.className ) ).toEqual( false )
      });
    });

    describe( 'when the AddAnnotation widget has already been created', function () {
      beforeEach( function () {
        this.view = new crayon.views.AddAnnotationView();
        this.coordinator.windows.createWidget = this.view;
        spyOn( this.view, 'render' );

        this.coordinator.showCreateWidget( this.annotation );
      });

      it( 'should render the view', function () {
        expect( this.view.render ).toHaveBeenCalled();
      });
    });
  });

  describe( '#showTextEditor', function () {

    beforeEach( function () {
      spyOn( crayon.views, 'TextEditorWrapperView' ).and.returnValue({ render: function () {} });
      spyOn( this.coordinator, 'setActive' );
    });

    describe( 'when there is not a textEditorView', function () {

      beforeEach( function () {
        var data = {type: 'comment', id: 1};
        this.coordinator.showTextEditor( data );
      });

      it( 'should instantiate a new view', function () {
        expect( crayon.views.TextEditorWrapperView ).toHaveBeenCalled();
      });

      it( 'should activate that view', function () {
        expect( this.coordinator.setActive ).toHaveBeenCalled();
      });
    });

    describe( 'when there is a textEditor view already', function () {

      beforeEach( function () {
        this.view = {
          remove: function () {},
          commentableType: 'comment',
          commentableId: 1
        };

        this.coordinator.windows.textEditorView = this.view;

        spyOn( this.view, 'remove' );
      });

      describe( 'and that view is for the same object', function () {
        beforeEach( function () {
          var data = {type: 'comment', id: 1};
          this.coordinator.showTextEditor( data );
        });

        it( 'should not remove the view', function () {
          expect( this.view.remove ).not.toHaveBeenCalled();
        });

        it( 'should not instantiate a new view', function () {
          expect( crayon.views.TextEditorWrapperView ).not.toHaveBeenCalled();
        });
      });

      describe( 'and that view is for a different type of object', function () {
        beforeEach( function () {
          var data = {type: 'reply', id: 1};
          this.coordinator.showTextEditor( data );
        });

        it( 'should remove the current view', function () {
          expect( this.view.remove ).toHaveBeenCalled();
        });

        it( 'should instantiate a new view', function () {
          expect( crayon.views.TextEditorWrapperView ).toHaveBeenCalled();
        });

        it( 'should activate that view', function () {
          expect( this.coordinator.setActive ).toHaveBeenCalled();
        });
      });

      describe( 'and that view is for a different object of the same type', function () {
        beforeEach( function () {
          var data = {type: 'comment', id: 2};
          this.coordinator.showTextEditor( data );
        });

        it( 'should remove the current view', function () {
          expect( this.view.remove ).toHaveBeenCalled();
        });

        it( 'should instantiate a new view', function () {
          expect( crayon.views.TextEditorWrapperView ).toHaveBeenCalled();
        });

        it( 'should activate that view', function () {
          expect( this.coordinator.setActive ).toHaveBeenCalled();
        });
      });
    });
  });

  describe( '#setActive', function () {

    beforeEach( function () {
      var oldEl = document.createElement( 'div' );
      oldEl.className = "crayon-active-window";

      this.oldView = {element: oldEl};
      this.newView = {element: document.createElement( 'div' )};

      this.coordinator.activeWindow = this.oldView;

      this.coordinator.setActive( this.newView );
    });

    it( 'should remove the active class from the current active window', function () {
      expect( !!this.oldView.element.className.match(/crayon-active-window/) ).toEqual( false );
    });

    it( 'should add the active class to the new active window', function () {
      expect( !!this.newView.element.className.match(/crayon-active-window/) ).toEqual( true );
    });

    it( 'should set the new view as active', function () {
      expect( this.coordinator.activeWindow ).toEqual( this.newView );
    });
  });

  describe( '#_getContentWindows', function () {

    beforeEach( function () {
      this.coordinator.windows = [{iframe: {contentWindow: {}}},null,{iframe: {contentWindow: {}}}, {}];
    });

    it( 'should return a list of content windows', function () {
      var expectedResult = [{}, {}];
      expect( this.coordinator._getContentWindows() ).toEqual( expectedResult );
    });

    describe( 'when there are no current windows', function () {

      beforeEach( function () {
        this.coordinator.windows = [null, {}]
      });

      it( 'should return an empty list', function () {
        expect( this.coordinator._getContentWindows() ).toEqual( [] );
      });
    });
  });

});
