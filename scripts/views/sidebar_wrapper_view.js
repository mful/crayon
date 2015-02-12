crayon.views || ( crayon.views = {} );

crayon.views.SidebarWrapperView = ( function () {

  SidebarWrapperView.prototype.id = 'crayon-sidebar-wrapper';
  SidebarWrapperView.prototype.className = 'crayon-sidebar-wrapper-view crayon-window';

  function SidebarWrapperView ( params ) {
    this.commentId = params.commentId;
    this.element = assembleTemplate();
    this.iframe = this.element.querySelector( 'iframe' );

    this.iframe.src = crayon.helpers.routes.replies_url( this.commentId );
  };

  SidebarWrapperView.prototype.render = function () {
    document.body.appendChild( this.element );
    return this;
  };

  SidebarWrapperView.prototype.remove = function () {
    document.body.removeChild( this.element );
    return this;
  };

  SidebarWrapperView.prototype.notifyRemove = function () {
    crayon.dispatcher.dispatch({
      message: crayon.constants.CommentConstants.REMOVE_WINDOW,
      data: {view: this}
    });
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
