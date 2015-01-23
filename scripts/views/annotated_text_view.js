crayon.views || ( crayon.views = {} )

crayon.views.AnnotatedTextView = ( function () {

  function AnnotatedTextView ( annotation ) {
    this.model = annotation;
    this.rendered = false;
  };

  AnnotatedTextView.prototype.render = function () {
    var elements, containingNode, matchRegex, node, i;
    if ( this.rendered ) return this;

    elements = this.findAnnotationElements2();

    for ( i = 0; i < elements.length; i++ ) {
      matchRegex = new RegExp( crayon.helpers.utility.regexEscape(elements[i].matchStr.trim()) );
      // containingNode = crayon.helpers.utility.find(
      //   elements[i].element.childNodes,
      //   function ( node ) {
      //     return !!node.nodeValue && !!node.nodeValue.match( matchRegex );
      //   }
      // );

      // newNode = this._createModifiedNode( containingNode, elements[i].matchStr.replace(/\s+$/, '') );
      newNode = this._createModifiedNode( elements[i].element, elements[i].matchStr.trim() );

      elements[i].element.parentElement.replaceChild( newNode, elements[i].element );
    }

    this.rendered = true;

    return this;
  };

  // AnnotatedTextView.prototype.findAnnotationElements = function () {
  //   var results, sentences, i, j, parentNode, sentResults, rawResults, testText;
  //   parentNode = this.model.selectedNode ? this.model.selectedNode : document.body;
  //   results = [];

  //   // first try by full text
  //   rawResults = this._getDOMNodesFromText( this.model.attributes.text, parentNode );

  //   if ( rawResults.snapshotLength < 1 ) {
  //     // next try by full sentences
  //     sentences = crayon.helpers.utility.separateSentences( this.model.attributes.text );
  //     sentResults = [];

  //     for ( i = 0; i < sentences.length; i++ ) {
  //       this._appendResult( results, sentences[i], parentNode );
  //     }
  //   } else {

  //     // TODO: handle multiples -- need more views. Extract to lib?
  //     for ( j = 0; j < rawResults.snapshotLength; j++ ) {
  //       results.push(
  //         {
  //           element: rawResults.snapshotItem( j ),
  //           matchStr: this.model.attributes.text
  //         }
  //       );
  //     }

  //   }

  //   return results;
  // };

  AnnotatedTextView.prototype.findAnnotationElements2 = function () {
    var results, sentences, i, j, parentNode, sentResults, rawResults, testText;
    parentNode = this.model.selectedNode ? this.model.selectedNode : document.body;
    results = [];

    // first try by full text
    rawResults = this._getDOMNodesFromText2( this.model.attributes.text, parentNode );

    if ( rawResults.length < 1 ) {
      // next try by full sentences
      sentences = crayon.helpers.utility.separateSentences( this.model.attributes.text );
      sentResults = [];

      for ( i = 0; i < sentences.length; i++ ) {
        this._appendResult2( results, sentences[i], parentNode );
      }
    } else {

      // TODO: handle multiples -- need more views. Extract to lib?
      for ( j = 0; j < rawResults.length; j++ ) {
        results.push(
          {
            element: rawResults[j],
            matchStr: this.model.attributes.text
          }
        );
      }

    }

    return results;
  };

  // private

  // AnnotatedTextView.prototype._appendResult = function ( results, testText, parentNode, leftovers ) {
  //   if ( !leftovers ) leftovers = [];
  //   var rawResults = this._getDOMNodesFromText( testText, parentNode );

  //   switch ( rawResults.snapshotLength ) {
  //     case 1:
  //       results.push({
  //         element: rawResults.snapshotItem(0),
  //         matchStr: testText.trim()
  //       });

  //       if ( leftovers.length > 0 )
  //         return this._appendResult( results, leftovers.join(''), parentNode );

  //       break;
  //     case 0:
  //       leftovers.unshift( testText.match(/\s\S*\s?$/)[0] );
  //       testText = testText.trim().replace( /\s\S*$/, '' );
  //       return this._appendResult( results, testText, parentNode, leftovers );
  //     default:
  //       // find all that are adjacent to the rest of the annotated text?
  //       break;
  //   }

  //   return results;
  // };

  AnnotatedTextView.prototype._appendResult2 = function ( results, testText, parentNode, leftovers ) {
    if ( !leftovers ) leftovers = [];
    var rawResults = this._getDOMNodesFromText2( testText, parentNode );

    switch ( rawResults.length ) {
      case 1:
        results.push({
          element: rawResults[0],
          matchStr: testText
        });

        if ( leftovers.length > 0 )
          return this._appendResult2( results, leftovers.join(''), parentNode );

        break;
      case 0:
        leftovers.unshift( testText.match(/\s\S*\s?$/)[0] );
        testText = testText.trim().replace( /\s\S*$/, '' );
        return this._appendResult2( results, testText, parentNode, leftovers );
      default:
        // find all that are adjacent to the rest of the annotated text?
        console.log( 'MORE THAN ONE NODE' );
        break;
    }

    return results;
  };

  // AnnotatedTextView.prototype._getDOMNodesFromText = function ( text, parentNode ) {
  //   if ( !parentNode ) parentNode = document.body;

  //   return(
  //     document.evaluate(
  //       "//*[contains(translate(text(), \"'’\", ''), '" + text.trim().replace(/['’]/g, '') + "')]",
  //       parentNode,
  //       null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
  //     )
  //   );
  // };

  AnnotatedTextView.prototype._getDOMNodesFromText2 = function ( text, parentNode ) {
    var matchRegex = new RegExp( crayon.helpers.utility.regexEscape(text.trim()) ),
        results = [],
        i;

    if ( !this.nodes ) {
      this.nodes = [];
      crayon.helpers.dom.getBaseNodes( parentNode, this.nodes );
    }

    for ( i = 0; i < this.nodes.length; i++ ) {
      if ( !!this.nodes[i].textContent.match(matchRegex) ) results.push( this.nodes[i] );
    }

    return results;
  };

  AnnotatedTextView.prototype._createModifiedNode = function ( node, matchStr ) {
    var div = document.createElement('div'),
        frag = document.createDocumentFragment();

    div.innerHTML = node.nodeValue.replace(
      crayon.helpers.utility.escapedRegex( matchStr.trim() ),
      '<span class="crayon-annotation-text-view">$&</span>'
    );

    while ( div.firstChild ) {
      frag.appendChild( div.firstChild );
    }

    return frag;
  };

  return AnnotatedTextView;

})();
