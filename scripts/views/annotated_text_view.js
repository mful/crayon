crayon.views || ( crayon.views = {} )

crayon.views.AnnotatedTextView = ( function () {

  function AnnotatedTextView ( annotation, nodes ) {
    this.model = annotation;
    this.nodes = nodes;
    this.baseNodes = [];
    crayon.helpers.dom.getBaseTextNodes( document.body, this.baseNodes );
  };

  AnnotatedTextView.prototype.render = function () {
    var _this = this,
        newNode;

    if ( !this.elements ) {
      this.elements = this.nodes.map( function ( node ) {
        newNode = _this._createModifiedNode(
          node,
          _this.nodes.indexOf( node ) === 0,
          _this.nodes.indexOf( node ) === _this.nodes.length - 1
        );
        node.node.parentElement.replaceChild( newNode, node.node );

        return newNode
      });
    }

    return this;
  };

  AnnotatedTextView.prototype._createModifiedNode = function ( nodeData, first, last ) {
    var div = document.createElement('div'),
        frag = document.createDocumentFragment();

    if ( first && last ) {
      div.innerHTML = nodeData.node.nodeValue.replace(
        new RegExp( "([.!?]\\s+|^)(" + crayon.helpers.utility.regexEscape(nodeData.matchStr.trim()) + ")(\\s|$)" ),
        '$1<span class="crayon-annotation-text-view">$2</span>$3'
      );
    } else if ( first ) {
      div.innerHTML = nodeData.node.nodeValue.replace(
        new RegExp( crayon.helpers.utility.regexEscape(nodeData.matchStr.trim()) + '.*$' ),
        '<span class="crayon-annotation-text-view">$&</span>'
      );
    } else if ( last ) {
      div.innerHTML = nodeData.node.nodeValue.replace(
        new RegExp( '^.*' + crayon.helpers.utility.regexEscape(nodeData.matchStr.trim()) ),
        '<span class="crayon-annotation-text-view">$&</span>'
      );
    } else {
      div.innerHTML = nodeData.node.nodeValue.replace(
        new RegExp( nodeData.node.nodeValue ),
        '<span class="crayon-annotation-text-view">$&</span>'
      );
    }

    while ( div.firstChild ) {
      frag.appendChild( div.firstChild );
    }

    return frag;
  };

  return AnnotatedTextView;

})();
