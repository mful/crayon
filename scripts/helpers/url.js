crayon.helpers || ( crayon.helpers = {} )

crayon.helpers.url = {
  toQueryStr: function ( data ) {
    var prop, propStrs, val;
    if ( data === null ) data = {};

    propStrs = [];

    for ( prop in data ) {
      val = data[prop]
      propStrs.push( "" + encodeURIComponent( prop ) + "=" + encodeURIComponent( val ));
    }

    return propStrs.join( '&' );
  },

  currentHref: function () {
    return window.location.href;
  }
};
