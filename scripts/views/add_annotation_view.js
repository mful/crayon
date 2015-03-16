crayon.views || ( crayon.views = {} )

crayon.views.AddAnnotationView = ( function () {
  BREATHING_ROOM = 12;

  AddAnnotationView.prototype.id = 'crayon-add-annotation';
  AddAnnotationView.prototype.className = 'crayon-widget crayon-window crayon-add-annotation-view';

  AddAnnotationView.prototype.inactiveImgSrc = crayon.env === 'test' ? '' : chrome.extension.getURL("images/pencil_gray.svg");
  AddAnnotationView.prototype.activeImgSrc = crayon.env === 'test' ? '' : chrome.extension.getURL("images/pencil_purple.svg");

  function AddAnnotationView () {
    this.render = this.render.bind( this );
    this.notifyAddAnnotation = this.notifyAddAnnotation.bind( this );
    this.element = this._template();
    this.img = this.element.querySelector( 'img' );
    this.delegateEvents();
  };

  AddAnnotationView.prototype.delegateEvents = function () {
    ev( this.element ).on( 'click', this.notifyAddAnnotation );
    return this;
  };

  AddAnnotationView.prototype.render = function ( model, sidebarPadding ) {
    var feedlyWidget;

    this.model = model;
    sidebarPadding || ( sidebarPadding = 0 );

    this.element.style.right = sidebarPadding + BREATHING_ROOM + 'px';

    if ( !document.getElementById(this.id) ) {
      feedlyWidget = document.getElementById( 'feedly-mini' );
      if ( feedlyWidget ) feedlyWidget.style.right = '55px';
      document.body.appendChild( this.element );
    } else {
      this.show();
    }

    return this;
  };

  // render helpers

  AddAnnotationView.prototype.show = function () {
    this.img.src = this.activeImgSrc;
    crayon.helpers.utility.addClass( this.element, 'active' )
  };

  AddAnnotationView.prototype.hide = function () {
    this.img.src = this.inactiveImgSrc;
    crayon.helpers.utility.removeClass( this.element, 'active' )
  };

  AddAnnotationView.prototype._template = function() {
    var container, contents;

    contents = "<img src=\"" + this.inactiveImgSrc + "\"></i>";
    container = document.createElement('div');
    container.id = this.id;
    container.className = this.className;
    container.innerHTML = contents;

    return container;
  };

  // event handlers

  AddAnnotationView.prototype.notifyAddAnnotation = function () {
    if ( !this.element.className.match(/active/) ) return;

    return crayon.dispatcher.dispatch({
      message: crayon.constants.AnnotationConstants.ADD_ANNOTATION,
      data: this.model
    });
  };

  return AddAnnotationView;

})();
