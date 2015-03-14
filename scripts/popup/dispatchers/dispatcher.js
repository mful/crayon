popup.dispatchers || ( popup.dispatchers = {} )

popup.dispatchers.Dispatcher = ( function () {
  function Dispatcher () {}

  Dispatcher.prototype.dispatch = function ( payload ) {
    var _this = this;

    switch( payload.message ) {
      case crayon.constants.SessionConstants.AUTH_NEEDED:
        _this.relayToCrayon( payload );
        break;
      case crayon.constants.NotificationConstants.NOTIFICATIONS_CHANGE:
        _this.relayToBackground( payload );
        break;
    }

    return true;
  };

  Dispatcher.prototype.relayToBackground = function ( payload ) {
    popup.courier.longDistance( payload.message, payload.data );
  };

  Dispatcher.prototype.relayToCrayon = function ( payload ) {
    popup.courier.post( payload, function () {}, {closePopup: true} );
  };

  return Dispatcher;

})();
