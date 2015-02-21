crayon.views || ( crayon.views = {} );

crayon.views.AuthWrapperView = ( function () {

  AuthWrapperView.prototype.id = 'crayon-auth-wrapper';
  AuthWrapperView.prototype.className = 'crayon-auth-wrapper-view crayon-window';

  function AuthWrapperView () {
    this.element = assembleTemplate();
    this.iframe = this.element.querySelector( 'iframe' );

    this.notifyRemove = this.notifyRemove.bind( this );
  };

  AuthWrapperView.prototype.render = function ( referringAction ) {
    this.iframe.src = crayon.helpers.routes.signup_url({ referring_action: referringAction });
    document.body.appendChild( this.element );

    this.delegateEvents();

    return this;
  };

  AuthWrapperView.prototype.remove = function () {
    document.body.removeChild( this.element );
    return this;
  };

  AuthWrapperView.prototype.delegateEvents = function () {
    ev( this.element ).on( 'click', this.notifyRemove );

    return this;
  };

  AuthWrapperView.prototype.notifyRemove = function () {
    crayon.dispatcher.dispatch({
      message: crayon.constants.WindowConstants.REMOVE_WINDOW,
      data: {view: this}
    });
  };

  var assembleTemplate = function () {
    var wrapper, innerHTML;

    wrapper = document.createElement( 'div' );
    wrapper.id = AuthWrapperView.prototype.id;
    wrapper.className = AuthWrapperView.prototype.className;

    innerHTML = "<iframe id=\"crayon-auth-wrapper-frame\" onload=\"this.style.visibility='visible';\"></iframe>";

    wrapper.innerHTML = innerHTML;

    return wrapper;
  };

  return AuthWrapperView;

})();
