crayon.observers || ( crayon.observers = {} );

crayon.observers.MouseupObserver = ( function () {

  function MouseupObserver () {
    this.delegateEvents();
  };

  MouseupObserver.prototype.delegateEvents = function () {
    ev( document ).on( 'mouseup', this.notifyMouseup );
    return this;
  };

  MouseupObserver.prototype.notifyMouseup = function ( e ) {
    return crayon.dispatcher.dispatch({
      message: crayon.constants.UserActionConstants.MOUSEUP,
      data: e
    });
  };

  return MouseupObserver;

})();
