describe( 'crayon.coordinators.AnnotatedTextManager', function () {

  beforeEach( function () {
    this.coordinator = new crayon.coordinators.AnnotatedTextManager();
  });

  afterEach( function () {
    delete this.coordinator;
  });

  describe( '#showAllOnPage', function () {

    beforeEach( function () {
      this.annotations = [{}, {}, {}];

      this.coordinator.showAllOnPage( '' );
    });

    afterEach( function () {
      delete this.annotations;
    });

    describe( 'when not given a callback', function () {

      beforeEach( function () {
        var _this = this;

        spyOn( crayon.models.Annotation, 'fetchAllForPage' ).and.callFake( function ( url, callback ) {
          callback( _this.annotations );
        });

        spyOn( this.coordinator, 'injectAnnotation' );

        this.coordinator.showAllOnPage( '' );
      });

      it( 'should inject all the annotations for the page', function () {
        expect( this.coordinator.injectAnnotation.calls.count() ).toEqual( this.annotations.length );
      });
    });

    describe( 'when given a callback', function () {

      beforeEach( function () {
        var _this = this;

        spyOn( crayon.models.Annotation, 'fetchAllForPage' ).and.callFake( function ( url, callback ) {
          callback( _this.annotations );
        });

        spyOn( this.coordinator, 'injectAnnotation' );

        this.coordinator.showAllOnPage( '', function () {} );
      });

      it( 'should inject all the annotations for the page', function () {
        expect( this.coordinator.injectAnnotation.calls.count() ).toEqual( this.annotations.length );
      });
    });
  });

  describe( '#getAnnotationById', function () {

    var views = [
      {model: {attributes: {id: 1}}},
      {model: {attributes: {id: 2}}},
      {model: {attributes: {id: 3}}}
    ]

    beforeEach( function () {
      this.originalViews = this.coordinator.views;
      this.coordinator.views = views;
    });

    afterEach( function () {
      this.coordinator.views = this.originalViews;
    });

    describe( 'when the model is present', function () {
      it( 'should return the annotation', function () {
        expect( this.coordinator.getAnnotationById(2) ).toEqual( views[1].model )
      });
    });

    describe( 'when the model is not present', function () {
      it( 'should return the null', function () {
        expect( this.coordinator.getAnnotationById(5) ).toEqual( null )
      });
    });
  });

  describe( '#injectAnnotation', function () {

    beforeEach( function () {
      this.injector = {inject: function () {}};

      spyOn( crayon.services, 'AnnotationInjector' ).and.returnValue( this.injector );
      spyOn( this.injector, 'inject' );

      this.coordinator.injectAnnotation( {} );
    });

    afterEach( function () {
      delete this.injector;
    });

    it( 'should inject the annotation into the page', function () {
      expect( this.injector.inject ).toHaveBeenCalled();
    });

    it( 'should add the annotation view to the collections of views', function () {
      expect( this.coordinator.views.length ).toEqual( 1 );
    });
  });

  describe( '#activateAnnotation', function () {

    var annotation = {id: 1};

    beforeEach( function () {

      this.view = {model: annotation, setActive: function() {}};
      this.view1 = {model: {id: 2}, setActive: function() {}};
      this.view2 = {model: {id: 3}, setActive: function() {}};

      this.coordinator.views = [this.view1, this.view, this.view2]

      spyOn( this.view, 'setActive' );
      spyOn( this.view1, 'setActive' );
      spyOn( this.view2, 'setActive' );
    });

    describe( 'when given an annotation', function () {

      beforeEach( function () {
        this.coordinator.activateAnnotation( annotation );
      });

      it( 'should activate the active view', function () {
        expect( this.view.setActive ).toHaveBeenCalledWith( true );
      });

      it( 'should deactivate the other views', function () {
        expect( this.view1.setActive ).toHaveBeenCalledWith( false );
        expect( this.view2.setActive ).toHaveBeenCalledWith( false );
      });
    });
  });

  describe( '#deactivateAnnotations', function () {

    beforeEach( function () {
      this.view = {setActive: function() {}};
      this.view1 = {setActive: function() {}};
      this.view2 = {setActive: function() {}};

      this.coordinator.views = [this.view1, this.view, this.view2]

      spyOn( this.view, 'setActive' );
      spyOn( this.view1, 'setActive' );
      spyOn( this.view2, 'setActive' );

      this.coordinator.deactivateAnnotations();
    });

    it( 'should deactivate all views', function () {
      expect( this.view.setActive ).toHaveBeenCalledWith( false );
      expect( this.view1.setActive ).toHaveBeenCalledWith( false );
      expect( this.view2.setActive ).toHaveBeenCalledWith( false );
    });
  });
});
