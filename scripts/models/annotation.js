crayon.models || ( crayon.models = {} );

crayon.models.Annotation = ( function () {
  var MIN_FRAGMENT_LENGTH = 10,
      MAX_TEXT_LENGTH = 400,
      MIN_TEXT_LENGTH = 5;

  Annotation.createFromSelection = function ( selection ) {
    var annotation = new Annotation();
    annotation.attributes.text = annotation.parseText( selection );
    annotation.attributes.url = crayon.helpers.url.currentHref();

    return annotation;
  };

  Annotation.fetchAllForPage = function ( url, callback ) {
    crayon.helpers.xhr.get(
      crayon.helpers.routes.api_page_annotations_url( url ),
      function ( err, response ) {
        if ( err ) return callback( [] );

        var annotations = response.data.annotations.map( function ( annotation ) {
          return new Annotation( annotation );
        });

        return callback( annotations );
      }
    );
  };

  Annotation.prototype.defaults = {
    text: null,
    url: null
  };

  function Annotation ( attributes ) {
    if( !attributes ) attributes = {};

    this.attributes = crayon.helpers.utility.merge( this.defaults, attributes );
    this.cid = crayon.helpers.utility.uniqueId( 'annotation_' );
    this.errors = [];

    this.toQueryStr = this.toQueryStr.bind( this );
  };

  Annotation.prototype.isValid = function () {
    if ( this.errors.length < 1 ) this.validate();
    return this.errors.length < 1 ? true : false;
  };

  Annotation.prototype.parseText = function ( selection ) {
    var nodeSentences, selectedSentences, annotationSentences, selectedRegex,
        selectedNodes;
    nodesSentences = [];
    if ( selection.isCollapsed || selection.rangeCount < 1 ) return '';

    selectedSentences = crayon.helpers.utility.separateSentences( selection.toString() );
    this._pruneSentences( selectedSentences );
    this.selectedNode = crayon.helpers.selection.getSelectedParentNode( selection );
    nodeSentences = crayon.helpers.utility.separateSentences( this.selectedNode.textContent );
    annotationSentences = this._assembleAnnotationSentences( selectedSentences, nodeSentences );

    return annotationSentences.join('').trim();
  };

  Annotation.prototype.toQueryStr = function () {
    return crayon.helpers.url.toQueryStr({
      text: this.attributes.text,
      url: this.attributes.url
    });
  };

  Annotation.prototype.validate = function () {
    var diff;

    if ( this.attributes.text.length > MAX_TEXT_LENGTH ) {
      diff = this.attributes.text.length - MAX_TEXT_LENGTH;

      this.errors.push(
        "The highlighted text is " + diff + " characters too long.\n\n" +
        "To avoid annotations that are only different by a couple words, " +
        "annotations are limited to full sentences (don't worry -- Scribble " +
        "automatically expands the highlighted text to full sentences). After " +
        "expanding to full sentences, the selected text was " + diff + " " +
        "characters over the " + MAX_TEXT_LENGTH + " character limit."
      );
    } else if ( this.attributes.text.length < MIN_TEXT_LENGTH ) {
      diff = MIN_TEXT_LENGTH - this.attributes.text.length;

      this.errors.push(
        "The highlighted text is " + diff + " characters too short.\n\n" +
        "Please select at least " + MIN_TEXT_LENGTH + "characters to annotate."
      );
    }
  };

  // private helpers

  Annotation.prototype._assembleAnnotationSentences = function( selectedSentences, nodeSentences ) {
    var annotationSentences, i, j, k;
    annotationSentences = [];

    for ( i = 0; i < selectedSentences.length; i++ ) {
      for ( j = 0; j < nodeSentences.length; j++ ) {
        if ( nodeSentences[j] === null ) continue;

        if ( this._matchesSelection(selectedSentences, i, nodeSentences, j) ) {
          if ( annotationSentences.length === 0 ) {
            // Set to null to prevent matches to earlier sentences, with common
            // fragments. Use null instead of splicing the list to avoid
            // disrupting the current loop, by resetting the indices in
            // nodeSentences.
            for ( k = 0; k < j; k++ ) {
              nodeSentences[k] = null;
            }
          }

          annotationSentences.push( nodeSentences[j] );
          continue;
        }

      }
    }

    return annotationSentences;
  };

  // Checks if the current sentence contains a text fragment, AND if either
  //   (a) the text fragment is the last of the selection
  // or
  //   (b) the next fragment in the selection matches the next sentence.
  Annotation.prototype._matchesSelection =
    function ( selectedSents, selectedIndex, parentSents, parentIndex ) {
      return(
        crayon.helpers.utility.isContained(
          parentSents[parentIndex],
          selectedSents[selectedIndex]
        )
        && (
             !selectedSents[selectedIndex + 1]
             || crayon.helpers.utility.isContained(
                  parentSents[parentIndex + 1],
                  selectedSents[selectedIndex + 1]
                )
           )
      )
  }

  Annotation.prototype._pruneSentences = function ( sentences ) {
    if ( sentences.length < 1 ) return [];

    if ( this._shouldBePruned(sentences[0]) ) sentences.splice( 0, 1 );

    if ( sentences.length > 0 ) {
      var lastIndex = sentences.length - 1;
      if ( this._shouldBePruned(sentences[lastIndex]) ) sentences.splice( lastIndex, 1 );
    }

    return sentences;
  };

  Annotation.prototype._shouldBePruned = function ( text ) {
    return text.length < MIN_FRAGMENT_LENGTH && !crayon.helpers.selection.isSentenceCompliant( text );
  };

  return Annotation;

})();
