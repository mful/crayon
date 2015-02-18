crayon.coordinators || ( crayon.coordinators = {} )

crayon.coordinators.AnnotatedTextManager = ( function () {

  function AnnotatedTextManager () {
    this.views = [];
  };

  AnnotatedTextManager.prototype.showAllOnPage = function ( url ) {
    var _this = this;

    crayon.models.Annotation.fetchAllForPage(
      url,
      function ( annotations ) {

        for ( i = 0; i < annotations.length; i++ ) {
          _this.injectAnnotation( annotations[i] );
        }

        return annotations;
      }
    )
  };

  AnnotatedTextManager.prototype.injectAnnotation = function ( annotation ) {
    var newViews;

    injector = new crayon.services.AnnotationInjector( annotation, crayon.views.AnnotatedTextView );
    newViews = injector.inject();
    this.views = this.views.concat( newViews );

    return newViews;
  };

  AnnotatedTextManager.prototype.activateAnnotation = function ( annotation ) {
    var i, activeView;

    this.removeActiveIfUnpersisted();

    for ( i = 0; i < this.views.length; i++ ) {
      if ( this.views[i].model === annotation ) {
        activeView = this.views[i].setActive( true );
        this.activeView = activeView;
      } else {
        this.views[i].setActive( false );
      }
    }

    return activeView;
  };

  AnnotatedTextManager.prototype.deactivateAnnotations = function () {
    for ( var i = 0; i < this.views.length; i++ ) {
      this.views[i].setActive( false );
    }
  };

  AnnotatedTextManager.prototype.persistActiveAnnotation = function ( annotation ) {
    if ( this.activeView && !this.activeView.model.attributes.id )
      this.activeView.model = annotation;
  };

  AnnotatedTextManager.prototype.removeActiveIfUnpersisted = function () {
    var viewIndex;

    if ( this.activeView && !this.activeView.model.attributes.id ) {
      viewIndex = this.views.indexOf( this.activeView );
      this.activeView.remove();
      this.activeView = null;
      this.views.slice( viewIndex, viewIndex + 1 );
    }
  };

  return AnnotatedTextManager;

})();
