crayon.views || ( crayon.views = {} )

crayon.views.AddAnnotationView = ( function () {
  BREATHING_ROOM = 12;

  AddAnnotationView.prototype.id = 'crayon-add-annotation';
  AddAnnotationView.prototype.className = 'crayon-widget crayon-window crayon-add-annotation-view hidden';

  function AddAnnotationView () {
    this.render = this.render.bind( this );
    this.notifyAddAnnotation = this.notifyAddAnnotation.bind( this );
    this.element = this._template();
    this.delegateEvents();
  };

  AddAnnotationView.prototype.delegateEvents = function () {
    ev( this.element ).on( 'click', this.notifyAddAnnotation );
    return this;
  };

  AddAnnotationView.prototype.render = function ( model, sidebarPadding ) {
    this.model = model;
    sidebarPadding || ( sidebarPadding = 0 );

    if ( !document.getElementById( this.id ) )
      document.body.appendChild( this.element );

    this.element.style.right = sidebarPadding + BREATHING_ROOM + 'px';
    this.show();

    return this;
  };

  // render helpers

  AddAnnotationView.prototype.show = function () {
    return crayon.helpers.utility.removeClass( this.element, 'hidden' );
  };

  AddAnnotationView.prototype.hide = function () {
    return crayon.helpers.utility.addClass( this.element, 'hidden' );
  };

  AddAnnotationView.prototype._template = function() {
    var container, contents;

    contents = "<i class=\"ion-android-add\"></i>";
    container = document.createElement('div');
    container.id = this.id;
    container.className = this.className;
    container.innerHTML = contents;

    return container;
  };

  // event handlers

  AddAnnotationView.prototype.notifyAddAnnotation = function () {
    return crayon.dispatcher.dispatch({
      message: crayon.constants.AnnotationConstants.ADD_ANNOTATION,
      data: this.model
    });
  };

  return AddAnnotationView;

})();
