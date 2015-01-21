window.crayon || ( window.crayon = {} );

crayon.models || ( crayon.models = {} );

crayon.models.Annotation = ( function () {

  Annotation.prototype.attributes = {
    text: null,
    url: null
  };

  function Annotation ( selection ) {
    this.toQueryStr = this.toQueryStr.bind( this );
    this.attributes.text = this.parseText( selection );
    this.attributes.url = crayon.helpers.url.currentHref();
  }

  Annotation.prototype.parseText = function ( selection ) {
    var selectedText, nodeSentences, selectedSentences, annotationSentences,
        selectedRegex, selectedNodes;
    nodesSentences = [];
    if ( selection.isCollapsed || selection.rangeCount < 1 ) return '';

    selectedText = selection.toString();
    selectedSentences = crayon.helpers.utility.separateSentences( selectedText );
    selectedNodes = crayon.helpers.selection.getSelectedParentNodes( selection );
    nodeSentences = this._sentencesFromNodes( selectedNodes );
    annotationSentences = this._assembleAnnotationSentences( selectedSentences, nodeSentences );

    return annotationSentences.join(' ').trim();
  };

  Annotation.prototype.toQueryStr = function () {
    return crayon.helpers.url.toQueryStr( this.attributes )
  };

  // private helpers

  Annotation.prototype._assembleAnnotationSentences = function( selectedSentences, nodeSentences ) {
    var annotationSentences, i, j, selectedRegex, escapedStr;
    annotationSentences = [];

    for ( i = 0; i < selectedSentences.length; i++ ) {
      for ( j = 0; j < nodeSentences.length; j++ ) {
        escapedStr = crayon.helpers.utility.regexEscape( selectedSentences[i] );
        selectedRegex = new RegExp( escapedStr );
        if ( nodeSentences[j].trim().match( selectedRegex )) {
          annotationSentences.push( nodeSentences[j] );
          continue;
        }
      }
    }

    return annotationSentences;
  };

  Annotation.prototype._sentencesFromNodes = function ( nodes ) {
    var content, sentences, i, j, nodeSents;
    sentences = [];

    for ( i = 0; i < nodes.length; i++ ) {
      nodeSents = crayon.helpers.utility.separateSentences( nodes[i].textContent );
      sentences = sentences.concat( nodeSents );
    }

    return sentences;
  };

  return Annotation;

})();
