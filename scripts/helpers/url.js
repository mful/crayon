crayon.helpers || ( crayon.helpers = {} );
crayon.helpers.url = {};

( function ( namespace ) {
  namespace.toQueryStr = function ( data ) {
    var prop, propStrs, val;
    if ( data === null ) data = {};

    propStrs = [];

    for ( prop in data ) {
      val = data[prop]
      propStrs.push( "" + encodeURIComponent( prop ) + "=" + encodeURIComponent( val ));
    }

    return propStrs.join( '&' );
  };

  namespace.currentHref = function () {
    return window.location.href;
  };
})( crayon.helpers.url );
