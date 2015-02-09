crayon.mediators || ( crayon.mediators = {} );

crayon.mediators.Courier = ( function () {

  function Courier  () {
    this.delegateEvents();
  };

  Courier.prototype.delegateEvents = function () {
    window.addEventListener( 'message', this.receivePackage, false );
  };

  Courier.prototype.post = function ( contentWindow, message, data ) {
    contentWindow.postMessage(
      JSON.stringify({ message: message, data: data }),
      '*'
    );
  };

  Courier.prototype.receivePackage = function ( event ) {
    if ( event.origin !== crayon.helpers.routes.origin() || event.data === "!_{h:''}" ) return;
    return crayon.dispatcher.dispatch( JSON.parse(event.data) );
  };

  return Courier;

})();
