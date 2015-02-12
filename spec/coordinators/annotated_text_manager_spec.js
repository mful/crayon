describe( 'crayon.coordinators.AnnotatedTextManager', function () {

  beforeEach( function () {
    this.coordinator = new crayon.coordinators.AnnotatedTextManager();
  });

  afterEach( function () {
    delete this.coordinator;
  });

  describe( '#showAllOnPage', function () {

    beforeEach( function () {
      var _this = this;
      this.annotations = [{}, {}, {}];

      spyOn( crayon.models.Annotation, 'fetchAllForPage' ).and.callFake( function ( url, callback ) {
        callback( _this.annotations );
      });

      spyOn( this.coordinator, 'injectAnnotation' );

      this.coordinator.showAllOnPage( '' );
    });

    afterEach( function () {
      delete this.annotations;
    });

    it( 'should inject all the annotations for the page', function () {
      expect( this.coordinator.injectAnnotation.calls.count() ).toEqual( this.annotations.length );
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
    beforeEach( function () {
      var annotation = {};

      this.view = {model: annotation, setActive: function() {}};
      this.view1 = {model: {}, setActive: function() {}};
      this.view2 = {model: {}, setActive: function() {}};

      this.coordinator.views = [this.view1, this.view, this.view2]

      spyOn( this.view, 'setActive' );
      spyOn( this.view1, 'setActive' );
      spyOn( this.view2, 'setActive' );

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
