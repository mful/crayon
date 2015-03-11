popup.views || ( popup.views = {} );

popup.views.PopupWrapperView = ( function () {

  PopupWrapperView.prototype.id = 'crayon-popup-wrapper';
  PopupWrapperView.prototype.className = 'crayon-popup-wrapper-view';

  function PopupWrapperView () {
    this.element = document.getElementById( this.id );
    this.iframe = this.element.querySelector( 'iframe' );
  };

  PopupWrapperView.prototype.render = function ( url ) {
    url || ( url = crayon.helpers.routes.notifications_url() );
    this.iframe.src = url;
  };

  return PopupWrapperView;

})();
