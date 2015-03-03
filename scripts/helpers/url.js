crayon.helpers || ( crayon.helpers = {} );
crayon.helpers.url = {};

( function ( namespace ) {

  namespace.currentHref = function () {
    return window.location.href;
  };

  namespace.currentLocation = function () {
    return window.location;
  };

  namespace.queryObject = function () {
    var params = {},
        queryString = namespace.currentLocation().search.substring(1),
        queryParams = queryString.split('&'),
        i, paramPair, value;

    for ( i = 0; i < queryParams.length; i++ ) {
      paramPair = queryParams[i].split('=');

      // convert boolean and numeric params using JSON
      try { value = JSON.parse( paramPair[1] ); } catch ( e ) { value = paramPair[1] };

      params[paramPair[0]] = value;
    }

    return params;
  };

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
})( crayon.helpers.url );
