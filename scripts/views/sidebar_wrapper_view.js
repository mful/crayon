crayon.views || ( crayon.views = {} );

crayon.views.SidebarWrapperView = ( function () {

  SidebarWrapperView.prototype.id = 'crayon-sidebar-wrapper';
  SidebarWrapperView.prototype.className = 'crayon-sidebar-wrapper-view crayon-window';

  function SidebarWrapperView () {
    this.element = assembleTemplate();
    this.iframe = this.element.querySelector( 'iframe' );
    this.rendered = false;

    this.notifyRemove = this.notifyRemove.bind( this );
  };

  SidebarWrapperView.prototype.render = function ( url ) {
    if ( !this.rendered ) {
      document.body.appendChild( this.element );
      this.delegateEvents();
    }

    this.iframe.src = url;
    this.rendered = true;

    return this;
  };

  SidebarWrapperView.prototype.remove = function () {
    document.body.removeChild( this.element );
    return this;
  };

  SidebarWrapperView.prototype.notifyRemove = function () {
    crayon.dispatcher.dispatch({
      message: crayon.constants.WindowConstants.REMOVE_WINDOW,
      data: {view: this}
    });
  };

  SidebarWrapperView.prototype.delegateEvents = function () {
    ev( this.element.querySelector('.crayon-close-sidebar') ).
      on( 'click', this.notifyRemove );

    return this;
  };

  var assembleTemplate = function () {
    var wrapper, innerHTML;

    wrapper = document.createElement( 'div' );
    wrapper.id = SidebarWrapperView.prototype.id;
    wrapper.className = SidebarWrapperView.prototype.className;

    innerHTML = "<iframe></iframe><div class=\"crayon-close-sidebar\"><i class=\"ion-android-close\"></i></div>";

    wrapper.innerHTML = innerHTML;

    return wrapper;
  };

  return SidebarWrapperView;

})();
