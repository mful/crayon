describe( 'crayon.coordinators.WindowManager', function () {

  beforeEach( function () {
    this.coordinator = new crayon.coordinators.WindowManager();
  });

  afterEach( function () {
    delete this.coordinator;
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
        this.coordinator.handleMouseup();
      });

      afterEach( function () {
        delete this.view;
      });

      it( 'should close the bubble, and null out the reference', function () {
        expect( this.view.remove ).toHaveBeenCalled();
      });

      it( 'should null out the reference', function () {
        expect( this.coordinator.windows.annotationBubble === null ).toEqual( true );
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
  });

  describe( '#showCommentsBubble', function () {
    describe( 'when there already is an active bubble', function () {
      beforeEach( function () {
        this.childView = {render: function () {}};
        var data = {
          element: document.createElement( 'div' ),
          annotation: new crayon.models.Annotation({ id: 1 }),
          view: this.childView
        };
        this.view = {remove: function () {}};
        this.coordinator.windows.annotationBubble = this.view;

        spyOn( crayon.views, 'AnnotationBubbleWrapperView' ).and.returnValue( this.childView );
        spyOn( this.view, 'remove' );
        spyOn( this.childView, 'render' );

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
});
