popup.mediators || ( popup.mediators = {} );

popup.mediators.PopupCourier = ( function () {

  function PopupCourier () {

    console.log( chrome.tabs );

    this.receivePackage = this.receivePackage.bind( this );
    this.delegateEvents();
  };

  PopupCourier.prototype.delegateEvents = function () {
    window.parent.addEventListener( 'message', this.receivePackage, false );
    if ( chrome && chrome.runtime ) {
      chrome.runtime.onMessage.addListener( this.receiveExtensionMessage );
    }
  };

  PopupCourier.prototype.post = function ( data, callback, options ) {
    options || ( options = {} );

    chrome.tabs.query( {active: true}, function ( tabs ) {
      for ( var tab in tabs ) {
        chrome.tabs.sendMessage( tabs[tab].id, JSON.stringify( data ), callback );
      }
    });

    if ( options.closePopup ) window.close();
  };

  PopupCourier.prototype.receiveExtensionMessage = function ( message, sender, callback ) {
    popup.dispatcher.dispatch({
      message: message,
      data: {sender: sender, callback: callback}
    });
  };

  PopupCourier.prototype.receivePackage = function ( event ) {
    if ( event.origin !== crayon.helpers.routes.origin() || event.data === "!_{h:''}" ) return;
    return popup.dispatcher.dispatch( JSON.parse(event.data) );
  };

  return PopupCourier;

})();
