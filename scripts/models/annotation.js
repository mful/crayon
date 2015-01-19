window.crayon || ( window.crayon = {} );

crayon.models || ( crayon.models = {} );

crayon.models.Annotation = ( function () {

  Annotation.prototype.attributes = {
    text: null
  };

  function Annotation ( selection ) {
    this.toQueryStr = this.toQueryStr.bind( this );
    this.newUrl = this.newUrl( this );
    this.attributes.text = this.parseText( selection );
  }

  Annotation.prototype.parseText = function ( selection ) {
    var i = 0,
        text = '';

    while ( i < selection.rangeCount ) {
      text += selection.getRangeAt( i ).cloneContents().textContent + ' ';
      i++;
    }

    return text.trim();
  };

  Annotation.prototype.newUrl = function () {
    return crayon.baseDomain + ( "/annotations/new?" + ( this.toQueryStr() ));
  };

  Annotation.prototype.toQueryStr = function () {
    var prop, propStrs, val, _ref;
    propStrs = [];
    _ref = this.attributes;

    for ( prop in _ref ) {
      val = _ref[prop];
      propStrs.push( "" + encodeURIComponent( prop ) + "=" + encodeURIComponent( val ));
    }
    propStrs.push( "url=" + ( encodeURIComponent( this.getLocation() )));

    return propStrs.join( '&' );
  };

  Annotation.prototype.getLocation = function () {
    return window.location.href;
  };

  return Annotation;

})();
