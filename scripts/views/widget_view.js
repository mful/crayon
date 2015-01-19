crayon.view || ( crayon.views = {} )

crayon.views.WidgetView = ( function () {

  WidgetView.prototype.id = 'crayon-create-annotation';
  WidgetView.prototype.className = 'crayon-widget';

  function WidgetView () {
    this.render = this.render.bind( this );
    this.element = this._template();
    this.delegateEvents();
  };

  WidgetView.prototype.delegateEvents = function () {
    // stub
    return this
  };

  WidgetView.prototype.render = function ( model ) {
    this.model = model;

    if ( !document.getElementById( this.id ) )
      document.body.appendChild( this.element );
    this.show();

    return this;
  };

  WidgetView.prototype.show = function() {
    this.element.style.display = 'block';
  };

  WidgetView.prototype.hide = function() {
    this.element.style.display = 'none';
  };

  WidgetView.prototype._template = function() {
    var container, contents;

    contents = "<div class='header'><div class='caret-wrapper'><div class='caret-up'></div></div><div class='title'>Add Annotation</div></div><div class='iframe-wrapper'></div>";
    container = document.createElement('div');
    container.id = this.id;
    container.className = this.className;
    container.innerHTML = contents;

    return container;
  };

  return WidgetView;

})();
