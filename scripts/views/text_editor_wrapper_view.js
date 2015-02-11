crayon.views || ( crayon.views = {} );

crayon.views.TextEditorWrapperView = ( function () {

  TextEditorWrapperView.prototype.id = 'crayon-text-editor-wrapper';
  TextEditorWrapperView.prototype.className = 'crayon-text-editor-wrapper-view crayon-window';

  function TextEditorWrapperView ( params ) {
    this.commentableType = params.commentableType;
    this.commentableId = params.commentableId;

    this.element = assembleTemplate();
    this.iframe = this.element.querySelector( 'iframe' );

    this.iframe.src = this.iframeSrc( this.commentableType, this.commentableId );

    this.notifyRemove = this.notifyRemove.bind( this );
  };

  TextEditorWrapperView.prototype.render = function () {
    document.body.appendChild( this.element );
    this.delegateEvents();

    return this;
  };

  TextEditorWrapperView.prototype.delegateEvents = function () {
    ev(
      this.element.querySelector('.crayon-close-text-editor')
    ).on( 'click', this.notifyRemove );
  };

  TextEditorWrapperView.prototype.remove = function () {
    document.body.removeChild( this.element );
    return this;
  };

  TextEditorWrapperView.prototype.notifyRemove = function () {
    crayon.dispatcher.dispatch({
      message: crayon.constants.WindowConstants.REMOVE_WINDOW,
      data: {view: this}
    });
  };

  TextEditorWrapperView.prototype.iframeSrc = function ( type, id ) {
    switch ( type ) {
      case 'comment':
        return crayon.helpers.routes.new_annotation_comment_url( id );
      case 'reply':
        // stub
        return '';
      default:
        return null;
    }
  };

  var assembleTemplate = function () {
    var wrapper, innerHTML;

    wrapper = document.createElement( 'div' );
    wrapper.id = TextEditorWrapperView.prototype.id;
    wrapper.className = TextEditorWrapperView.prototype.className;

    innerHTML = "<iframe onload=\"this.style.visibility='visible';\"></iframe><div class=\"crayon-close-text-editor\"><i class=\"ion-android-close\"></i></div>";

    wrapper.innerHTML = innerHTML;

    return wrapper;
  };

  return TextEditorWrapperView;

})();
