window.background || ( window.background = {} )
window.crayon || ( window.crayon = {} );

background.mediators || ( background.mediators = {} );
background.dispatchers || ( background.dispatchers = {} );
crayon.helpers = {};
crayon.constants = {};

crayon.env || ( crayon.env = 'development' );

background.init = function () {
  background.dispatcher = new background.dispatchers.Dispatcher();
  background.courier = new background.mediators.BackgroundCourier();
};
