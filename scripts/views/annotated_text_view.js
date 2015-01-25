crayon.views || ( crayon.views = {} )

crayon.views.AnnotatedTextView = ( function () {

  function AnnotatedTextView ( annotation ) {
    this.model = annotation;
    this.rendered = false;
    this.baseNodes = [];
    crayon.helpers.dom.getBaseTextNodes( document.body, this.baseNodes );
  };

  AnnotatedTextView.prototype.render = function () {
    var elements, containingNode, matchRegex, node, i;
    if ( this.rendered ) return this;

    elements = this.findAnnotationElements();

    for ( i = 0; i < elements.length; i++ ) {
      isFirst = i === 0
      isLast = i === elements.length - 1
      newNode = this._createModifiedNode( elements[i], isFirst, isLast );
      elements[i].element.parentElement.replaceChild( newNode, elements[i].element );
    }

    this.rendered = true;

    return this;
  };

  AnnotatedTextView.prototype.findAnnotationElements = function () {
    var results = [];

    return this._appendResult( results, this.model.attributes.text );
  };

  // private

  AnnotatedTextView.prototype._appendResult = function ( results, testText, leftovers ) {
    if ( !leftovers ) leftovers = [];
    var rawResults = this._getDOMNodesFromText( testText, this.model.selectedNode );

    switch ( rawResults.length ) {
      case 1:
        results.push({
          element: rawResults[0],
          matchStr: testText
        });

        if ( leftovers.length > 0 )
          return this._appendResult( results, leftovers.join('') );

        break;
      case 0:
        // return null if current chain cannot complete
        if ( testText.trim().split(/\s/).length === 1 ) {

        } else {
          leftovers.unshift( testText.match( /\s\S+\s*$/)[0] );
          testText = testText.trim().replace( /\s\S+$/, '' );
        }

        return this._appendResult( results, testText, leftovers );
      default:
        if ( results.length > 0 ) {

          // Grab the next base node with text and match to rawResults
          var bookmark = this.baseNodes.indexOf( results[results.length - 1].element ),
              nextNode, correctRes, i;
          for ( i = bookmark + 1; i < this.baseNodes.length; i++ ) {
            nextNode = this.baseNodes[i];
            if ( nextNode.textContent && !!nextNode.textContent.trim() ) break;
          }

          correctRes = crayon.helpers.utility.find( rawResults, function ( res ) {
            return res === nextNode;
          });

          results.push({
            element: correctRes,
            matchStr: testText
          });

          if ( leftovers.length > 0 )
            return this._appendResult( results, leftovers.join('') );

          break;


        } else {
          if ( leftovers.length < 1 ) {
            // well, we have multiple of the same annotation
            // Probably going to have to move all of this code to an outside
            // object, to handle this case.
            console.log( 'multiple valid annotations' );
          } else {
            // get nodes that exactly match the testText. Partial mastches are
            // not candidates, because they would have been matched by an earlier
            // interation, with more included leftovers. We can only assume this
            // due the the check on leftovers.length above.
            var candidates = crayon.helpers.utility.filter( rawResults, function ( res ) {
              return res.textContent.trim() === testText.trim();
            })

            if ( candidates.length === 1 ) {
              results.push({
                element: candidates[0],
                matchStr: testText
              });

              // no need to check leftover length, as we check above
              return this._appendResult( results, leftovers.join('') );
            } else {
              var leftoversText, leftoversRegex, i, j, bookmark, followingText, filteredCandidates;
              leftoversText = leftovers.join('').trim();
              leftoversRegex = new RegExp(
                '^' + crayon.helpers.utility.regexEscape( leftoversText )
              );
              filteredCandidates = [];

              for ( i = 0; i < candidates.length; i++ ) {
                bookmark = this.baseNodes.indexOf( candidates[i] );
                followingText = '';

                while( followingText.trim().length < leftoversText.length ) {
                  bookmark++;
                  followingText += this.baseNodes[bookmark].textContent;
                }

                if ( followingText.trim().match( leftoversRegex ) ) {
                  filteredCandidates.push( candidates[i] )
                }
              }

              if ( filteredCandidates.length === 1 ) {
                results.push({
                  element: filteredCandidates[0],
                  matchStr: testText
                });

                // no need to check leftover length, as we check above
                return this._appendResult( results, leftovers.join('') );
              } else if ( filteredCandidates.length > 1 ) {
                // multiple annotations
              }
            }
          }
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

  AnnotatedTextView.prototype._createModifiedNode = function ( nodeData, first, last ) {
    var div = document.createElement('div'),
        frag = document.createDocumentFragment();

    if ( first ) {
      div.innerHTML = nodeData.element.nodeValue.replace(
        new RegExp( crayon.helpers.utility.regexEscape(nodeData.matchStr.trim()) + '.*$' ),
        '<span class="crayon-annotation-text-view">$&</span>'
      );
    } else if ( last ) {
      div.innerHTML = nodeData.element.nodeValue.replace(
        new RegExp( '^.*' + crayon.helpers.utility.regexEscape(nodeData.matchStr.trim()) ),
        '<span class="crayon-annotation-text-view">$&</span>'
      );
    } else {
      div.innerHTML = nodeData.element.nodeValue.replace(
        new RegExp( nodeData.element.nodeValue ),
        '<span class="crayon-annotation-text-view">$&</span>'
      );
    }

    while ( div.firstChild ) {
      frag.appendChild( div.firstChild );
    }

    return frag;
  };

  AnnotatedTextView.prototype._getDOMNodesFromText = function ( text, parentNode ) {
    if ( !parentNode ) parentNode = document.body;
    var matchStr = text.trim().replace( /(.)[,\.\?\!\:;\|\/\}\]\)\*=]$/, '$1');
    var results = [],
        matchRegex,
        i;
    matchRegex = crayon.helpers.utility.escapedRegex( matchStr )

    for ( i = 0; i < this.baseNodes.length; i++ ) {
      if ( !!this.baseNodes[i].textContent.match(matchRegex) ) results.push( this.baseNodes[i] );
    }

    return results;
  };

  return AnnotatedTextView;

})();
