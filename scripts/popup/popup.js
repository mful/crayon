window.popup = {};
window.crayon = {};

popup.mediators || ( popup.mediators = {} );
crayon.helpers = {};
crayon.constants = {};

crayon.env || ( crayon.env = 'development' );

popup.init = function () {
  popup.dispatcher = new popup.dispatchers.Dispatcher();
  popup.courier = new popup.mediators.PopupCourier();
  new popup.views.PopupWrapperView().render();
};

( function () {
  document.addEventListener( 'DOMContentLoaded', function () {
    popup.init();
  });
})();
