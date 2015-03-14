popup.mediators || ( popup.mediators = {} );

popup.mediators.PopupCourier = ( function () {

  function PopupCourier () {
    this.receivePackage = this.receivePackage.bind( this );
    this.delegateEvents();
  };

  PopupCourier.prototype.delegateEvents = function () {
    window.parent.addEventListener( 'message', this.receivePackage, false );
  };

  PopupCourier.prototype.post = function ( data, callback, options ) {
    options || ( options = {} );

    chrome.tabs.query( {active: true}, function ( tabs ) {
      for ( var tab in tabs ) {
        chrome.tabs.sendMessage( tabs[tab].id, data, callback );
      }
    });

    if ( options.closePopup ) window.close();
  };

  PopupCourier.prototype.longDistance = function ( message, data, options ) {
    options || ( options = {} );

    chrome.runtime.sendMessage(
      {
        message: message,
        data: data,
      }
    ,
      options.callback
    );
  };

  PopupCourier.prototype.receivePackage = function ( event ) {
    if ( event.origin !== crayon.helpers.routes.origin() || event.data === "!_{h:''}" ) return;
    return popup.dispatcher.dispatch( JSON.parse(event.data) );
  };

  return PopupCourier;

})();
