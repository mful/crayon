crayon.view || ( crayon.views = {} )

crayon.views.AddAnnotationView = ( function () {

  AddAnnotationView.prototype.id = 'crayon-create-annotation';
  AddAnnotationView.prototype.className = 'crayon-widget hidden';

  function AddAnnotationView () {
    this.render = this.render.bind( this );
    this.element = this._template();
    this.delegateEvents();
  };

  AddAnnotationView.prototype.delegateEvents = function () {
    // stub
    return this
  };

  AddAnnotationView.prototype.render = function ( model ) {
    this.model = model;

    if ( !document.getElementById( this.id ) )
      document.body.appendChild( this.element );
    this.show();

    return this;
  };

  AddAnnotationView.prototype.show = function() {
    return crayon.helpers.utility.removeClass( this.element, 'hidden' );
  };

  AddAnnotationView.prototype.hide = function() {
    return crayon.helpers.utility.addClass( this.element, 'hidden' );
  };

  AddAnnotationView.prototype._template = function() {
    var container, contents;

    contents = "<div class='header'><div class='caret-wrapper'><div class='caret-up'></div></div><div class='title'>Add Annotation</div></div><div class='iframe-wrapper'></div>";
    container = document.createElement('div');
    container.id = this.id;
    container.className = this.className;
    container.innerHTML = contents;

    return container;
  };

  return AddAnnotationView;

})();
