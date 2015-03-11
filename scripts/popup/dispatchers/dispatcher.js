popup.dispatchers || ( popup.dispatchers = {} )

popup.dispatchers.Dispatcher = ( function () {
  function Dispatcher () {}

  Dispatcher.prototype.dispatch = function ( payload ) {
    var _this = this;

    switch( payload.message ) {
      case crayon.constants.SessionConstants.AUTH_NEEDED:
        _this.relayMessage( payload );
        break;
    }

    return true;
  };

  Dispatcher.prototype.relayMessage = function ( payload ) {
    popup.courier.post( payload, function () {}, {closePopup: true} );
  };

  return Dispatcher;

})();
