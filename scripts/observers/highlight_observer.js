crayon.observers || ( crayon.observers = {} );

// TODO: move to a service, which processes highlights following mousup events
// TODO: observed by crayon.observers.MouseupObserver?
crayon.observers.HighlightObserver = ( function () {

  function HighlightObserver () {
    this.notifyNewAnnotation = this.notifyNewAnnotation.bind( this );
    this.getSelection = this.getSelection.bind( this );
    this.highlight = this.highlight.bind( this );
    this.delegateEvents();
  };

  HighlightObserver.prototype.delegateEvents = function () {
    return ev( document ).on( 'mouseup', this.highlight );
  };

  HighlightObserver.prototype.highlight = function () {
    var _this = this;

    // defer to handle case where user clicks the highlighted area, taking an
    // extra event cycle to clear the window selection
    setTimeout( function () {
      var selection = _this.getSelection();

      if ( selection ) {
        return _this.notifyNewAnnotation( selection );
      } else {
        return _this.notifyClearHighlight();
      }
    }, 0 )
  };

  HighlightObserver.prototype.getSelection = function () {
    var blank, sel = window.getSelection();
    if ( sel.isCollapsed ) return null;

    if ( sel.rangeCount > 1 ) {
      return sel;
    } else if ( sel.rangeCount === 1 ) {
      blank = crayon.helpers.utility.isBlank( sel.getRangeAt( 0 ).cloneContents().textContent );
      return blank ? null : sel
    } else {
      return null;
    }
  };

  HighlightObserver.prototype.notifyNewAnnotation = function ( selection ) {
    return crayon.dispatcher.dispatch({
      message: crayon.constants.AnnotationConstants.NEW_ANNOTATION,
      data: selection
    });
  };

  HighlightObserver.prototype.notifyClearHighlight = function () {
    return crayon.dispatcher.dispatch({
      message: crayon.constants.UserActionConstants.CLEAR_HIGHLIGHT,
      data: {}
    })
  };

  return HighlightObserver;

})();
