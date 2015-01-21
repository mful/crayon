crayon.helpers || ( crayon.helpers = {} );

crayon.helpers.selection = {

  getSelectedParentNodes: function ( selection ) {
    if ( !selection || selection.isCollaped || selection.rangeCount < 1 ) return [];
    var selectedNodes, range, node, lastNode;
    selectedNodes = [];
    compliantNodes = [];
    range = selection.getRangeAt( 0 );

    // Highlighting bottom -> top vs top -> bottom affect which node is the
    // selection's focusNode and which is the anchorNode.
    if ( range.startContainer === selection.focusNode ) {
      node = selection.focusNode.parentNode;
      lastNode = selection.anchorNode.parentNode;
    } else {
      node = selection.anchorNode.parentNode;
      lastNode = selection.focusNode.parentNode;
    }

    if ( node === lastNode ) return [node];

    while ( node && node !== lastNode ) {
      selectedNodes.push( node );
      node = node.nextSibling;
    }
    selectedNodes.push( lastNode );

    // remove nodes which are children of other selectedNodes
    selectedNodes = crayon.helpers.selection.removeChildNodes( selectedNodes );

    return selectedNodes;
  },

  removeChildNodes: function ( nodeList ) {
    var childNodes, i;
    childNodes = crayon.helpers.selection.pluckChildNodes( nodeList );

    for ( i = 0; i < childNodes.length; i++ ) {
      nodeList.splice( nodeList.indexOf( childNodes[i] ), 1 )
    }

    return nodeList;
  },

  pluckChildNodes: function ( nodeList ) {
    var i, j, k, isChildNode, currentChildNodes, childNodes;
    childNodes = [];

    for ( i = 0; i < nodeList.length; i++ ) {
      isChildNode = false;

      for ( j = 0; j < nodeList.length; j++ ) {
        if ( nodeList[i] === nodeList[j] ) continue;

        currentChildNodes = [];
        crayon.helpers.selection.getAllDescendantsRecursively( nodeList[j], currentChildNodes );
        // remove element from list of its child nodes
        currentChildNodes.slice( 0, 1 );

        for ( k = 0; k < currentChildNodes.length; k++ ) {
          if ( currentChildNodes[k] == nodeList[i] ) {
            isChildNode = true;
            childNodes.push( nodeList[i] );
            break;
          }
        }

        if ( isChildNode ) break;
      }
    }

    return childNodes;
  },

  getAllDescendantsRecursively: function ( el, descendants ) {
    descendants.push( el );
    var children = el.childNodes;

    for( var i = 0; i < children.length; i++ ) {
      crayon.helpers.selection.getAllDescendantsRecursively( children[i], descendants );
    }
  },

  sentenceCompliantNodes: function ( nodes ) {
    for ( var i = 0; i < nodes.length; i++ ) {
      while ( !crayon.helpers.selection.isSentenceCompliant( nodes[i] ) ) {
        nodes[i] = nodes[i].parentNode;
      }
    }

    // remove duplicates

    // remove children

    return nodes;
  }

  isSentenceCompliant: function ( text ) {
    return !!text.match(/^[A-Z\d\$\(](.*)[.?!\n\r\v]$/);
  },
};
