crayon.mediators || ( crayon.mediators = {} );

crayon.mediators.Courier = ( function () {

  function Courier  () {
    this.receivePackage = this.receivePackage.bind( this );
    this.receiveExtensionMessage = this.receiveExtensionMessage.bind( this );
    this.delegateEvents();
  };

  Courier.prototype.delegateEvents = function () {
    window.addEventListener( 'message', this.receivePackage, false );
    if ( chrome && chrome.runtime ) {
      chrome.runtime.onMessage.addListener( this.receiveExtensionMessage );
    }
  };

  Courier.prototype.post = function ( contentWindow, message, data, options ) {
    contentWindow.postMessage(
      JSON.stringify({ message: message, data: data }),
      '*'
    );
  };

  Courier.prototype.longDistance = function ( message, data, options ) {
    options || ( options = {} );

    chrome.runtime.sendMessage(
      {
        message: message,
        data: data,
      }
    ,
      options.callback
    )
  };

  Courier.prototype.receiveExtensionMessage = function ( data, sender, callback ) {
    data.sender = sender;
    data.callback = callback;

    crayon.dispatcher.dispatch({
      message: data.message,
      data: data.data
    });
  };

  Courier.prototype.receivePackage = function ( event ) {
    if ( event.origin !== crayon.helpers.routes.origin() || event.data === "!_{h:''}" ) return;
    return crayon.dispatcher.dispatch( JSON.parse(event.data) );
  };

  return Courier;

})();
