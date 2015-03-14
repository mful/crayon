background.mediators || ( background.mediators = {} );

background.mediators.BackgroundCourier = ( function () {

  function BackgroundCourier () {
    this.receiveExtensionMessage = this.receiveExtensionMessage.bind( this );
    this.delegateEvents();
  };

  BackgroundCourier.prototype.delegateEvents = function () {
    chrome.runtime.onMessage.addListener( this.receiveExtensionMessage );
  };

  BackgroundCourier.prototype.receiveExtensionMessage = function ( data, sender, callback ) {
    data.sender = sender;
    data.callback = callback;

    background.dispatcher.dispatch({
      message: data.message,
      data: data.data
    });
  };

  return BackgroundCourier;

})();
