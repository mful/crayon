crayon.services || ( crayon.services = {} );

// TODO: Go through and comment the hell out of all of this
crayon.services.AnnotationInjector = ( function () {

  function AnnotationInjector ( annotation, viewClass ) {
    this.model = annotation;
    this.view = viewClass;
    this.baseNodes = [];
    crayon.helpers.dom.getBaseTextNodes( document.body, this.baseNodes );
  };

  AnnotationInjector.prototype.inject = function ( testText, leftovers, results, candidates ) {
    if ( !testText ) testText = this.model.attributes.text;
    if ( !leftovers ) leftovers = [];
    if ( !results ) results = [];
    if ( !candidates ) candidates = [];

    var rawResults = this._rawResults( testText, candidates );
    results = results.concat(
      this._processRawResults( rawResults, testText, leftovers )
    );

    if ( testText.trim().split(/\s/).length === 1 ) {
      return this._createViews( results );
    } else {
      var punctMatch = testText.match(/(\S+)([.?!:;,\)\/\}\]]\s*)$/);

      if ( punctMatch ) {
        // only want the second match group
        leftovers.unshift( punctMatch[2] );
        testText = testText.trim().replace(/(\S+)[.?!:;,\)\/\}\]]$/, '$1');
      } else {
        leftovers.unshift( testText.match(/\s\S+\s*$/)[0] );
        testText = testText.trim().replace(/\s\S+$/, '')
      }

      return this.inject(
        testText,
        leftovers,
        results,
        candidates.concat( rawResults )
      );
    }
  };

  // private

  AnnotationInjector.prototype._createViews = function ( nodeSets ) {
    var _this = this,
        sets = crayon.helpers.utility.compact( nodeSets );

    return sets.map(
      function ( nodeSet ) {
        return new _this.view( _this.model, nodeSet ).render();
      }
    );
  };

  AnnotationInjector.prototype._getDOMNodesFromText = function ( text ) {
    var matchRegex = crayon.helpers.utility.escapedRegex( text.trim() ),
        results = [],
        i;

    for ( i = 0; i < this.baseNodes.length; i++ ) {
      if ( crayon.helpers.utility.isContained(this.baseNodes[i].textContent, text) )
        results.push( this.baseNodes[i] );
    }

    return results;
  };

  // played with some functional concepts for this method and its helpers
  AnnotationInjector.prototype._getNodeSet = function ( candidates, baseNodes, matchStr, currentStr ) {
    var node = baseNodes[baseNodes.indexOf( candidates[candidates.length - 1].node ) + 1],
        normalizedCandidate,
        normalizedMatch;
    if ( !node ) return null;

    if ( (currentStr + node.textContent).trim().length < matchStr.length ) {
      return this._getNodeSet(
        candidates.concat(
          [{
            node: node,
            matchStr: node.textContent
          }]
        )
      ,
        baseNodes,
        matchStr,
        currentStr += node.textContent
      );
    }

    normalizedCandidate =
      crayon.helpers.utility.normalizeWhitespace( currentStr + node.textContent );
    normalizedMatch = crayon.helpers.utility.normalizeWhitespace( matchStr );
    if ( normalizedCandidate.trim().match(this._nodeCheckRegex( normalizedMatch )) ) {
      candidates.push({
        node: node,
        matchStr: this._lastMatchStr( candidates, matchStr )
      });

      return candidates;
    }

    return null;
  };

  AnnotationInjector.prototype._lastMatchStr = function ( candidates, matchStr ) {
    return matchStr.replace(
      this._nodeCheckRegex(
        candidates.slice( 1, candidates.length ).map( function ( candidate ) {
            return candidate.matchStr;
          }
        ).join( '' ).trim()
      ),
      ''
    );
  };

  AnnotationInjector.prototype._nodeCheckRegex = function ( text ) {
    return new RegExp(
      '^' + crayon.helpers.utility.regexEscape( text )
    );
  };

  AnnotationInjector.prototype._nodeSets = function ( candidates, testText, matchStr ) {
    var _this = this;

    return candidates.map( function ( candidate ) {
      return _this._getNodeSet( [{node: candidate, matchStr: testText}], _this.baseNodes, matchStr, '' );
    });
  };

  AnnotationInjector.prototype._processRawResults = function( rawResults, testText, leftovers ) {
    if ( leftovers.length < 1 ) {
      return rawResults.map( function ( res ) {
        return [{node: res, matchStr: testText}]
      });
    } else {
      return this._nodeSets(
        this._pruneResults(rawResults, testText),
        testText,
        leftovers.join( '' ).trim()
      );
    }
  };

  // get nodes where the end section of textContent matches the testText.
  // We only assume this due the the check on leftovers.length in #inject, above.
  AnnotationInjector.prototype._pruneResults = function ( results, matchText ) {
    var normalizedMatch = crayon.helpers.utility.normalizeWhitespace( matchText ),
        normalizedText;

    return crayon.helpers.utility.filter( results, function ( res ) {
      normalizedText = crayon.helpers.utility.normalizeWhitespace( res.textContent );
      return !!normalizedText.trim().match(
        crayon.helpers.utility.regexEscape( normalizedMatch.trim() ) + '$'
      );
    });
  }

  AnnotationInjector.prototype._rawResults = function ( testText, candidates ) {
    return crayon.helpers.utility.filter(
      this._getDOMNodesFromText( testText ),
      function ( node ) {
        return !crayon.helpers.utility.includes( candidates, node );
      }
    );
  };

  return AnnotationInjector;

})();
