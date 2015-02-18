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
    return(
      crayon.helpers.utility.isSentenceContained(
        parentText,
        selectionText
      )
    );
  };

  namespace.isSentenceCompliant = function ( text ) {
    var trimText = text.replace(/^\s*/, '');
    trimText = trimText.replace(/[ \t]*$/, '');
    return !!trimText.match(/^[A-Z\d\$\(]/) && !!trimText.match(/[.?!\f\n\r\v]$/);
  };
})( crayon.helpers.selection );
