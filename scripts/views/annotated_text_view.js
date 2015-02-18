crayon.views || ( crayon.views = {} );

crayon.views.AnnotatedTextView = ( function () {

  function AnnotatedTextView ( annotation, nodes ) {
    this.model = annotation;
    this.nodes = nodes;
    this.baseNodes = [];
    crayon.helpers.dom.getBaseTextNodes( document.body, this.baseNodes );

    this.showAnnotation = this.showAnnotation.bind( this );
  };

  AnnotatedTextView.prototype.render = function () {
    var _this = this,
        newNode;

    if ( !this.elements ) {
      this._injectNodes( this.nodes );

      this.elements = Array.prototype.slice.call(
        document.querySelectorAll( 'span[data-crayon-key="' + _this.model.cid + '"]' )
      );

      this.delegateEvents();
    }


    return this;
  };

  // TODO: add spec
  AnnotatedTextView.prototype.remove = function () {
    var i, frag;

    for ( i = 0; i < this.elements.length; i++ ) {
      frag = document.createDocumentFragment();
      frag.appendChild( this.elements[i].childNodes[0] );
      this.elements[i].parentElement.replaceChild( frag, this.elements[i] );
    }

    this.elements = [];

    return this;
  };

  AnnotatedTextView.prototype.delegateEvents = function () {
    for ( var i = 0; i < this.elements.length; i++ ) {
      ev( this.elements[i] ).on( 'click', this.showAnnotation );
    }

    return this;
  };

  AnnotatedTextView.prototype.getBounds = function () {
    return this._boundingCoordinates( this.elements );
  };

  AnnotatedTextView.prototype.setActive = function ( active ) {
    if ( this.active === active ) return;
    var i,
        func = active ? crayon.helpers.utility.addClass : crayon.helpers.utility.removeClass;

    for ( i = 0; i < this.elements.length; i++ ) {
      func( this.elements[i], 'crayon-active' )
    }

    this.active = active;

    return this;
  };

  // event handlers

  // TODO: update spec for if ( !this.model.attributes.id ) return;
  AnnotatedTextView.prototype.showAnnotation = function ( e ) {
    e.stopPropagation();
    if ( !this.model.attributes.id ) return;

    // dispatch event, along with element and xy coords to inject frame
    // needs to consider scroll position (display upper of lower?)
    return crayon.dispatcher.dispatch({
      message: crayon.constants.CommentConstants.SHOW_COMMENTS,
      data: {annotation: this.model}
    });
  };

  // private

  AnnotatedTextView.prototype._boundingCoordinates = function ( elements ) {
    // get top and bottom (max and min) y-coords, and left/right (max-min)
    // x-coords. Then compare to first element, to figure out css for injected
    // frame wrapper, to sit properly both above and below the text in question
    var rectangles, xmin, xmax, ymin, ymax;
    rectangles = elements.map( function ( el ) {
      return el.getBoundingClientRect();
    });

    for ( var i = 0; i < rectangles.length; i++ ) {
      if ( !xmin || rectangles[i].left < xmin ) xmin = rectangles[i].left;
      if ( !xmax || rectangles[i].right > xmax ) xmax = rectangles[i].right;
      if ( !ymin || rectangles[i].top < ymin ) ymin = rectangles[i].top;
      if ( !ymax || rectangles[i].bottom > ymax ) ymax = rectangles[i].bottom;
    }

    return {
      left: xmin,
      right: xmax,
      top: ymin,
      bottom: ymax
    }
  };

  // TODO: add test for when first && last, and node follows closing node, but does not start with punctuation
  AnnotatedTextView.prototype._createModifiedNode = function ( nodeData, first, last ) {
    var div = document.createElement('div'),
        frag = document.createDocumentFragment(),
        openTag = '<span class="crayon-annotation-text-view" data-crayon-key="' +
          this.model.cid + '">' ;

    if ( first && last ) {
      div.innerHTML = nodeData.node.nodeValue.replace(
        new RegExp( "([.!?]\\s+|^\\s+|^)(" + crayon.helpers.utility.regexEscape(nodeData.matchStr.trim()) + ")(\\s|$)" ),
        '$1' + openTag + '$2</span>$3'
      );
    } else if ( first ) {
      div.innerHTML = nodeData.node.nodeValue.replace(
        new RegExp( crayon.helpers.utility.regexEscape(nodeData.matchStr.trim()) + '.*$' ),
        openTag + '$&</span>'
      );
    } else if ( last ) {
      div.innerHTML = nodeData.node.nodeValue.replace(
        new RegExp( '^.*' + crayon.helpers.utility.regexEscape(nodeData.matchStr.trim()) ),
        openTag + '$&</span>'
      );
    } else {
      div.innerHTML = nodeData.node.nodeValue.replace(
        new RegExp( nodeData.node.nodeValue ),
        openTag + '$&</span>'
      );
    }

    while ( div.firstChild ) {
      frag.appendChild( div.firstChild );
    }

    return frag;
  };

  AnnotatedTextView.prototype._injectNodes = function ( nodes ) {
    var _this = this;

    return nodes.map( function ( node ) {
      var newNode = _this._createModifiedNode(
        node,
        nodes.indexOf( node ) === 0,
        nodes.indexOf( node ) === nodes.length - 1
      );

      return node.node.parentElement.replaceChild( newNode, node.node );
    });
  };

  return AnnotatedTextView;

})();
