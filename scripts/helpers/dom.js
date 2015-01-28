crayon.helpers || ( crayon.helpers = {} );
crayon.helpers.dom = {};

( function ( namespace ) {

  namespace.getBaseTextNodes = function ( el, nodes ) {
    !el.hasChildNodes() && el.nodeType === 3 ? nodes.push( el ) : el.normalize();
    var children = el.childNodes;

    for( var i = 0; i < children.length; i++ ) {
      crayon.helpers.dom.getBaseTextNodes( children[i], nodes );
    }
  };
})( crayon.helpers.dom );
