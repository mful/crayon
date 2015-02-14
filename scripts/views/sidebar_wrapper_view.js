crayon.views || ( crayon.views = {} );

crayon.views.SidebarWrapperView = ( function () {

  SidebarWrapperView.prototype.id = 'crayon-sidebar-wrapper';
  SidebarWrapperView.prototype.className = 'crayon-sidebar-wrapper-view crayon-window';

  function SidebarWrapperView () {
    this.element = assembleTemplate();
    this.iframe = this.element.querySelector( 'iframe' );
    this.rendered = false;
  };

  SidebarWrapperView.prototype.render = function ( url ) {
    if ( !this.rendered ) document.body.appendChild( this.element );
    this.iframe.src = url;
    this.rendered = true;

    return this;
  };

  SidebarWrapperView.prototype.remove = function () {
    document.body.removeChild( this.element );
    return this;
  };

  var assembleTemplate = function () {
    var wrapper, innerHTML;

    wrapper = document.createElement( 'div' );
    wrapper.id = SidebarWrapperView.prototype.id;
    wrapper.className = SidebarWrapperView.prototype.className;

    innerHTML = "<iframe></iframe>";

    wrapper.innerHTML = innerHTML;

    return wrapper;
  };

  return SidebarWrapperView;

})();
