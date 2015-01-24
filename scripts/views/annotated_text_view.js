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
        // return null if current chain cannot complete
        // relevant below, when multiple nodes match some testText
        if ( testText.trim().split(/\s/).length === 1 ) return null;

        leftovers.unshift( testText.match(/\s\S+\s*$/)[0] );
        testText = testText.trim().replace( /\s\S+$/, '' );

        return this._appendResult( results, testText, parentNode, leftovers );
      default:
        if ( leftovers.length < 1 ) {
          // well, we have multiple of the same annotation
          console.log( 'multiple valid annotations' );
        }

        if ( results.length > 0 ) {

          // Grab the next base node with text and match to rawResults
          var lastRes = results[results.length - 1];
          this.nodes.indexOf( lastRes );
          var nextNode;
          for ( i = this.nodes.indexOf(lastRes.element) + 1; i < this.nodes.length; i++ ) {
            nextNode = this.nodes[i];
            if ( nextNode.textContent && !!nextNode.textContent.trim() ) break;
          }

          var correctNode = crayon.helpers.utility.find( rawResults, function ( res ) {
            return res === nextNode;
          });

          results.push({
            element: correctNode,
            matchStr: testText
          });

          if ( leftovers.length > 0 )
            return this._appendResult( results, leftovers.join(''), parentNode );

          break;

          // get nodes that exactly match the testText. Partial mastches are
          // not candidates, because they would have been matched by an earlier
          // interation, with more included leftovers. We can only assume this
          // due the the check on leftovers.length above.
          var candidates = crayon.helpers.utility.filter( rawResults, function ( res ) {
            return res.textContent.trim() === testText.trim();
          })

          if ( candidates.length === 1 ) {
            // append result; continue with recursion
            results.push({
              element: candidates[0],
              matchStr: testText
            });

            if ( leftovers.length > 0 )
              return this._appendResult( results, leftovers.join(''), parentNode );

            break;
          } else if ( candidates.length > 1 ) {

            // Maybe check the next sibling w/textContent, checking against
            // leftovers.
            // If there are no matches and:
            //  - there are more siblings w/textContent ->
            //      not a match because there would be text in between the
            //      current results and the candidate.
            //  - there are no siblings ->
            //      step up to parent, grab next sibling w/textContent.
            //      If it matches leftovers ->
            //        we have a valid candidate
            //      else ->
            //        not valid, throw it out
            //
            var getNextSibWithText = function ( node ) {
              var sib = node.nextSibling;

              while ( sib && !sib.textContent.trim() ) {
                sib = sib.nextSibling;
              }

              return sib;
            }

            var filteredCandidates = [];
            for ( var i = 0; i < candidates.length; i++ ) {
              var node = getNextSibWithText( candidates[i] );
              if ( !node ) {
                node = getNextSibWithText( node.parentNode );
              }
              if ( !node ) continue;

              // Now match node against leftovers. Either the entire remaining
              // string (all leftovers) must be contained in the node, starting
              // at the beginning text of the node, or, the complete text of
              // the node must match a consecutive subset of leftovers,
              // starting from the first word.
              var leftoversRegex = new RegExp(
                '^' + crayon.helpers.utility.regexEscape( leftovers.join('').trim() )
              )
              // if ( node.textContent.match( leftoversRegex ) ) {
              //   // Definitely a match. Need to append result, then continue with checking?
              //   //
              //   filteredCandidates.push( candidates[i] );
              //   continue;
              // } else {
              //   var nodesTextContent = node.textContent;
              //   var leftoversStr = leftovers.join( '' ).trim();

              //   if ( nodesTextContent.trim().length >= leftoversStr.length ) {
              //     continue;
              //   } else {
              //     var nextNode = node;

              //     while ( nodesTextContent.trim().length < leftoversStr.length ) {
              //       var nextNode = getNextSibWithText( nextNode );
              //       if ( !node ) nextNode = getNextSibWithText( nextNode.parentNode );
              //       if ( !node ) break;

              //       nodesTextContent += nextNode.textContent;
              //     }

              //     if ( nodesTextContent.trim().length < leftoversStr.length ) continue;

              //     if ( nodesTextContent.trim().match( leftoversRegex ) ) {
              //       // Definitely a match. Need to append result, then continue with checking?
              //       //
              //       filteredCandidates.push( candidates[i] );
              //       continue;
              //     }
              //   }
              // }

              var nodesTextContent = node.textContent;
              var leftoversStr = leftovers.join( '' ).trim();
              var nextNode = node;

              while ( nodesTextContent.trim().length < leftoversStr.length ) {
                nextNode = getNextSibWithText( nextNode );
                if ( !node ) nextNode = getNextSibWithText( nextNode.parentNode );
                if ( !node ) break;

                nodesTextContent += nextNode.textContent;
              }

              if ( node.textContent.match( leftoversRegex ) ) {
                // A match! Need to append result, then continue with checking?
                // Maybe should instead just append all the results and return?
                filteredCandidates.push( candidates[i] );
                continue;
              }
            }

            if ( filteredCandidates.length === 1 ) {

            }



            break;

            // Following is previous ideas about how to handle

            // Maybe start a new _appendResult cycle, using only the leftovers
            // and then compare results?
            // What if there are multiple??????????
            // Need to run _appendResult cycle for each candidate, and see
            // which return complete complete results. The ones that do
            // Are valid annotations.
            for ( var i = 0; i < candidates.length; i++ ) {
              var followingNodes = _appendResult(
                [{ element: candidate, matchStr: testText }],
                leftovers.join(''),
                parentNode );
            }

            // now check if which candidates match with the following nodes

            // what if there are multiple sets of valid following nodes?
            var followingNodes = _appendResult( [], leftovers.join(''), parentNode );

            // first, siblings?
            // TODO: TEST THIS
            var sibCandidate =
              crayon.helpers.utility.find( candidates, function ( candidate ) {
                candidate.nextSibling === followingNodes[0].element;
              });

            if ( sibCandidate ) {
              // append result + followingNodes, return results;
              results.push({
                element: sibCandidate,
                matchStr: testText
              })
              results = results.concat( followingNodes );

              return results;
            }

            // grab the youngest common ancestor, and check if the text matches


            var followingParents = crayon.helpers.utility.parents( followingNodes[0] );
            var anscestors = [];
            // TODO: extract to common ancestor DOM helper?
            for ( var i = 0; i < candidates.length; i++ ) {
              var candidateParents =
                crayon.helpers.utility.parents( candidates[i] );

              if ( candidateParents[0] != followingParents[0] ) continue;

              for( var j = 0; j < followingParents.length; j++ ) {
                if (candidateParents[i] != followingParents[i]) {
                  ancestors.push({ index: i, el: candidateParents[i - 1] });
                }
              }
            }

            var youngestParent;

            // Check the following nodes for matches for following text
            // Going to have to check until either all text is accounted for
            // or we are down to one node.
            for ( var i = 0; i < candidates.length; i++ ) {

              if ( candidates[i].nextSibling ) {

                // need to handle case where there are no leftovers?
                // I guess that just means that there are multiple spots with
                // the annotation's text
                for ( var j = 0; j < leftovers.length; j++ ) {
                  var testStr = leftovers.slice( 0, j + 1 ).join( '' );

                  var newCandidates =
                    crayon.helpers.utility.filter( candidates, function ( candidate ) {
                      var regex = new RegExp(
                        '^' + crayon.helpers.utility.regexEscape( testStr )
                      );

                      return !!candidate.textContent.trim().match( regex );
                    });

                  if ( newCandidates.length === 1 ) {
                    // append original result, break loop, and continue recursion
                  } else if ( newCandidates.length < 1 ) {
                    // well...shit? Throw an error I guess. I don't think this
                    // should happen...
                  }
                }

              }
            }

            var newCandidateText = leftovers.join('');

            // check if any of the rawRes.parentElements contain, are contained
            // by, are siblings of, are the same as the last result parent
            // element
            for ( var i = 0; i < rawResults.length; i++ ) {
              candidateParent = rawResults[i].parentElement;
              resultParent = results[results.length - 1].parentElement;
              // if (  parents are equal and cand is next sibling of res  ) {
                // add to results, and continue recursion
              // } else if ( /* candP is next sibling of resP */ ) {
                // get first common parent, and check text match
                // if matched, add to results, and continue recursion
              // } else if ( /* resP is the parent of candP */ ) {
                // check resP text content
                // or check if res node's next sibling is candP?
                // if matched, add to results, and continue recursion
              // } else if ( /* candP is the parent of resP */ ) {
                // check candP text content
                // or check if cand node's next sibling is resP?
                // if matched, add to results, and continue recursion
              // } else {
                // do nothing -- continue this loop
              // }
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
