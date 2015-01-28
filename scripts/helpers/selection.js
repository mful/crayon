crayon.helpers || ( crayon.helpers = {} );
crayon.helpers.selection = {};

( function ( namespace ) {

  namespace.getSelectedParentNode = function ( selection ) {
    if ( !selection || selection.isCollaped || selection.rangeCount < 1 ) return null;
    var node = selection.getRangeAt( 0 ).commonAncestorContainer;

    while ( !namespace.isSuitableParent(node.textContent, selection.toString()) ) {
      node = node.parentNode;
    }

    return node;
  };

  namespace.isSuitableParent = function ( parentText, selectionText ) {
    var selectSents, parentSents;
    selectsSents = crayon.helpers.utility.separateSentences( selectionText );
    parentSents = crayon.helpers.utility.separateSentences( parentText );
    parentSents.splice( parentSents.length - 1, 1 );

    return(
      // In conjunction with the parentSents.splice call above, this prevents
      // climbing up the DOM tree after selection sentences are fully
      // encapsulated in the given node, when the given node does not end in a
      // a recognized sentence. Ex: node ends in a footnote widget.
      crayon.helpers.utility.isContained(
        parentSents.join(''),
        selectsSents[selectsSents.length - 1]
      ) ||
      crayon.helpers.selection.isSentenceCompliant( parentText )
    );
  };

  namespace.isSentenceCompliant = function ( text ) {
    var trimText = text.replace(/^\s*/, '');
    trimText = trimText.replace(/[ \t]*$/, '');
    return !!trimText.match(/^[A-Z\d\$\(]/) && !!trimText.match(/[.?!\f\n\r\v]$/);
  };
})( crayon.helpers.selection );
