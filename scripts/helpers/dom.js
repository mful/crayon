crayon.helpers || ( crayon.helpers = {} )

crayon.helpers.dom = {

  getBaseNodes: function ( el, nodes ) {
    el.hasChildNodes() ? el.normalize() : nodes.push( el );
    var children = el.childNodes;

    for( var i = 0; i < children.length; i++ ) {
      crayon.helpers.dom.getBaseNodes( children[i], nodes );
    }
  }
}
