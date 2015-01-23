crayon.views || ( crayon.views = {} )

crayon.views.AnnotatedTextView = ( function () {

  function AnnotatedTextView ( annotation ) {
    this.model = annotation;
    this.rendered = false;
  };

  AnnotatedTextView.prototype.render = function () {
    var elements, containingNode, matchRegex, node, i;
    if ( this.rendered ) return this;

    elements = this.findAnnotationElements();

    for ( i = 0; i < elements.length; i++ ) {
      newNode = this._createModifiedNode( elements[i].element, elements[i].matchStr.trim() );
      elements[i].element.parentElement.replaceChild( newNode, elements[i].element );
    }

    this.rendered = true;

    return this;
  };

  AnnotatedTextView.prototype.findAnnotationElements = function () {
    var results, sentences, i, j, parentNode, rawResults, testText;

    parentNode = this.model.selectedNode ? this.model.selectedNode : document.body;
    results = [];

    return this._appendResult( results, this.model.attributes.text, parentNode );
  };

  // private

  AnnotatedTextView.prototype._appendResult = function ( results, testText, parentNode, leftovers ) {
    if ( !leftovers ) leftovers = [];
    var rawResults = this._getDOMNodesFromText( testText, parentNode );

    switch ( rawResults.length ) {
      case 1:
        results.push({
          element: rawResults[0],
          matchStr: testText
        });

        if ( leftovers.length > 0 )
          return this._appendResult( results, leftovers.join(''), parentNode );

        break;
      case 0:
        leftovers.unshift( testText.match(/\s\S+\s*$/)[0] );
        testText = testText.trim().replace( /\s\S+$/, '' );
        return this._appendResult( results, testText, parentNode, leftovers );
      default:
        // find all that are adjacent to the rest of the annotated text?
        console.log( 'MORE THAN ONE NODE' );

        if ( results.length > 0 ) {
          // CAN WE SIMPLY CHECK IF THE SNIPPET IN QUESTION OCCURS AT THE END
          // OR BEGINNING OF THE RESULT NODE, DEPENDING ON CONTEXT???

          // check if any of the rawRes.parentElements contain, are contained
          // by, are siblings of, are the same as the last result parent
          // element
          for ( var i = 0; i < rawResults.length; i++ ) {
            candidateParent = rawResults[i].parentElement;
            resultParent = results[results.length - 1].parentElement;
            if ( /* parents are equal and cand is next sibling of res */ ) {
              // add to results, and continue recursion
            } else if ( /* candP is next sibling of resP */ ) {
              // get first common parent, and check text match
              // if matched, add to results, and continue recursion
            } else if ( /* resP is the parent of candP */ ) {
              // check resP text content
              // or check if res node's next sibling is candP?
              // if matched, add to results, and continue recursion
            } else if ( /* candP is the parent of resP */ ) {
              // check candP text content
              // or check if cand node's next sibling is resP?
              // if matched, add to results, and continue recursion
            } else {
              // do nothing -- continue this loop
            }
          }
        } else {
          // go up parent levels, and loop over testText + increasing leftovers
          // until all text is matched? Need to avoid reaching common parents of
          // raw results.

          // handle case where the are multiple of the same full annotation, on
          // the same page
        }

        break;
    }

    return results;
  };

  AnnotatedTextView.prototype._areElementsRelated = function ( predecessor, candidate ) {
    return(
      predecessor === candidate ||
      predecessor.nextSibling === candidate ||
      // these two then require some text checking
      crayon.helpers.utilty.includes( candidate.childNodes, predecessor ) ||
      crayon.helpers.utilty.includes( predecessor.childNodes, candidate )
    )
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

  AnnotatedTextView.prototype._getDOMNodesFromText = function ( text, parentNode ) {
    var matchRegex = crayon.helpers.utility.escapedRegex( text.trim() ),
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

  return AnnotatedTextView;

})();
