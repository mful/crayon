crayon.helpers || ( crayon.helpers = {} );
crayon.helpers.dom = {};

( function ( namespace ) {

  namespace.isChildOf = function ( parent, child ) {
    var children = parent.querySelectorAll( '*' );
    return crayon.helpers.utility.includes( children, child );
  };

  namespace.getBaseTextNodes = function ( el, nodes ) {
    !el.hasChildNodes() && el.nodeType === 3 ? nodes.push( el ) : el.normalize();
    var children = el.childNodes;

    for( var i = 0; i < children.length; i++ ) {
      crayon.helpers.dom.getBaseTextNodes( children[i], nodes );
    }
  };
})( crayon.helpers.dom );
