crayon.mediators || ( crayon.mediators = {} );

crayon.mediators.Courier = ( function () {

  function Courier  () {
    this.receivePackage = this.receivePackage.bind( this );
    this.delegateEvents();
  };

  Courier.prototype.delegateEvents = function () {
    window.addEventListener( 'message', this.receivePackage, false );
    if ( chrome && chrome.runtime ) {
      chrome.runtime.onMessage.addListener( this.receiveExtensionMessage );
    }
  };

  Courier.prototype.post = function ( contentWindow, message, data ) {
    contentWindow.postMessage(
      JSON.stringify({ message: message, data: data }),
      '*'
    );
  };

  Courier.prototype.receiveExtensionMessage = function ( message, sender, callback ) {
    var payload = JSON.parse( message );
    payload.data || ( payload.data = {} );

    payload.data.sender = sender;
    payload.data.callback = callback;

    crayon.dispatcher.dispatch( payload );
  };

  Courier.prototype.receivePackage = function ( event ) {
    if ( event.origin !== crayon.helpers.routes.origin() || event.data === "!_{h:''}" ) return;
    return crayon.dispatcher.dispatch( JSON.parse(event.data) );
  };

  return Courier;

})();
