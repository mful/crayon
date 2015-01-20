describe( 'crayon.coordinators.WindowManager', function () {

  beforeEach( function () {
    this.coordinator = new crayon.coordinators.WindowManager();
  });

  afterEach( function () {
    delete this.coordinator;
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

  describe( '#showCreateWidget', function () {
    beforeEach( function () {
      this.annotation = new crayon.models.Annotation({
        rangeCount: 1,
        getRangeAt: function ( i ){
          return {
            cloneContents: function () {
              return { textContent: ' We are not descended from fearful men.   ' };
            }
          }
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
