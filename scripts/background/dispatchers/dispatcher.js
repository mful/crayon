background.dispatchers || ( background.dispatchers = {} )

background.dispatchers.Dispatcher = ( function () {
  function Dispatcher () {}

  Dispatcher.prototype.dispatch = function ( payload ) {
    var _this = this;

    switch( payload.message ) {
      case crayon.constants.AppConstants.PAGE_LOAD:
      case crayon.constants.NotificationConstants.NOTIFICATIONS_CHANGE:
        _this.updateNotifications( payload.data );
        break;
    }

    return true;
  };

  Dispatcher.prototype.updateNotifications = function ( data ) {
    background.stores.NotificationStore.updateCount( data );
  };

  return Dispatcher;

})();
