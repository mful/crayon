crayon.views || ( crayon.views = {} )

crayon.views.AnnotatedTextView = ( function () {

  function AnnotatedTextView ( annotation ) {
    this.model = annotation;
    this.rendered = false;
  };

  AnnotatedTextView.prototype.render = function () {
    var elements, containingNode, matchRegex, node;
    if ( this.rendered ) return this;

    elements = this.findAnnotationElements();

    if ( elements.length === 1 ) {
      matchRegex = new RegExp( crayon.helpers.utility.regexEscape(elements[0].matchStr) );
      containingNode = crayon.helpers.utility.find(
        elements[0].element.childNodes,
        function ( node ) {
          return !!node.nodeValue && !!node.nodeValue.match( matchRegex )
        }
      );

      newNode = this._createModifiedNode( containingNode, elements[0].matchStr );

      elements[0].element.replaceChild( newNode, containingNode );
    } else {

    }

    this.rendered = true;

    return this;
  };

  AnnotatedTextView.prototype.findAnnotationElements = function () {
    var results, sentences, i, j, parentNode, sentResults, rawResults;
    parentNode = this.model.selectedNode ? this.model.selectedNode : document.body;
    results = [];

    // first try by full text
    rawResults = this._getDOMNodesFromText( this.model.attributes.text, parentNode );

    if ( rawResults.snapshotLength < 1 ) {
      // next try by full sentences
      sentences = crayon.helpers.utility.separateSentences( this.model.attributes.text );
      sentResults = [];

      for ( i = 0; i < sentences.length; i++ ) {
        rawResults = this._getDOMNodesFromText( sentences[i] );
        switch ( rawResults.snapshotLength ) {
          case 1:
            // sentResults[i] = rawResults.snapshotItem( 0 );
            break;
          case 0:
            // check by word
            break;
          default:
            // find all that are adjacent to the rest of the annotated text?
            break;
        }
      }
    } else {

      for ( j = 0; j < rawResults.snapshotLength; j++ ) {
        results.push(
          {
            element: rawResults.snapshotItem( j ),
            matchStr: this.model.attributes.text
          }
        );
      }

    }

    return results;
  };

  // private

  AnnotatedTextView.prototype._getDOMNodesFromText = function ( text, parentNode ) {
    if ( !parentNode ) parentNode = document.body;

    return(
      document.evaluate(
        '//*[contains(text(), "' + text + '")]',
        parentNode,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
      )
    );
  };

  AnnotatedTextView.prototype._createModifiedNode = function ( node, matchStr ) {
    var div = document.createElement('div'),
        frag = document.createDocumentFragment();

    div.innerHTML = node.nodeValue.replace(
      new RegExp( matchStr ),
      '<span class="crayon-annotation-text-view">$&</span>'
    );

    while ( div.firstChild ) {
      frag.appendChild( div.firstChild );
    }

    return frag;
  };

  return AnnotatedTextView;

})();
