window.crayon || ( window.crayon = {} );

crayon.models || ( crayon.models = {} );

crayon.models.Annotation = ( function () {

  Annotation.prototype.attributes = {
    text: null,
    url: null
  };

  function Annotation ( selection ) {
    this.toQueryStr = this.toQueryStr.bind( this );
    this.attributes.text = this.parseText( selection );
    this.attributes.url = crayon.helpers.url.currentHref();
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

  Annotation.prototype.toQueryStr = function () {
    return crayon.helpers.url.toQueryStr( this.attributes )
  };

  return Annotation;

})();
