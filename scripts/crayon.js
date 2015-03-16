window.crayon || ( window.crayon = {} );

crayon.env || ( crayon.env = 'development' );

crayon.containerId = 'crayon-wrapper';

crayon.models || ( crayon.models = {} );
crayon.dispatchers || ( crayon.dispatchers = {} );
crayon.coordinators || ( crayon.coordinators = {} );
crayon.observers || ( crayon.observers = {} );
crayon.mediators || ( crayon.mediators = {} );

crayon.init = function () {
  if ( crayon.isBlacklisted() ) return;

  crayon.annotatedTextManager = new crayon.coordinators.AnnotatedTextManager();
  crayon.windowManager = new crayon.coordinators.WindowManager();
  crayon.dispatcher = new crayon.dispatchers.Dispatcher();
  crayon.courier = new crayon.mediators.Courier();
  new crayon.observers.HighlightObserver();

  crayon.dispatcher.dispatch({
    message: crayon.constants.AppConstants.READY,
    data: {}
  });

  return this;
};

crayon.isBlacklisted = function () {
  var blacklist = ["twitter.com", "facebook.", "docs.google.com", "mail.yahoo.", "mail.google.", "inbox.google", "tuenti.com", "asana.com", "trello.com", "pivotaltracker.com"],
      hostname = document.location.hostname;

  for ( var i = 0; i < blacklist.length; i++ ) {
    if ( hostname.match(crayon.helpers.utility.escapedRegex( blacklist[i] )) )
      return true;
  }

  return false;
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
