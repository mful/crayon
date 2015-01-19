window.crayon || ( window.crayon = {} );

crayon.baseDomain = 'http://scribble.dev:3000';

crayon.containerId = 'crayon-wrapper';

crayon.models || ( crayon.models = {} );
crayon.dispatchers || ( crayon.dispatchers = {} );
crayon.coordinators || ( crayon.coordinators = {} );

crayon.init = function () {
  crayon.vent = ev( document.createElement( 'div' ) );
  crayon.windowManager = new crayon.coordinators.WindowManager();
  crayon.dispatcher = new crayon.dispatchers.Dispatcher();
  new crayon.observers.HighlightObserver();
  return this;
};

( function () {
  var startCrayon, crayonStartTimer = null;

  startCrayon = function () {
    if ( document.readyState !== 'complete' || typeof ev === 'undefined' ) {
      if ( crayonStartTimer !== null ) clearTimeout( crayonStartTimer );
      crayonStartTimer = setTimeout( startCrayon, 200 );
      return;
    }
    return crayon.init();
  };

  return startCrayon();
})();
