crayon.views || ( crayon.views = {} );

crayon.views.AnnotationBubbleWrapperView = ( function () {

  AnnotationBubbleWrapperView.prototype.id = 'crayon-bubble-wrap';
  AnnotationBubbleWrapperView.prototype.className = 'crayon-annotation-bubble-wrapper-view';
  var MAX_WIDTH = 762,
      MIN_WIDTH = 572
      HEIGHT = 272;

  function AnnotationBubbleWrapperView ( data ) {
    this.parent = data.element;
    this.parentView = data.view;
    this.model = data.annotation;
    this.element = assembleTemplate();
    this.iframe = this.element.querySelector('iframe');
    this.navigateToAnnotation();

    this.setPositionalCSS = this.setPositionalCSS.bind( this );

    this.debouncedResize = crayon.helpers.utility.debounce( this.setPositionalCSS, 500 );

    this._setParentOverflows();
  };

  AnnotationBubbleWrapperView.prototype.render = function () {
    this.setPositionalCSS();
    this.parent.appendChild( this.element );
    this.delegateEvents();

    return this;
  };

  AnnotationBubbleWrapperView.prototype.remove = function () {
    // clean up events and remove from DOM
    this.parent.removeChild( this.element );
    return this;
  };

  AnnotationBubbleWrapperView.prototype.delegateEvents = function () {
    if ( this.delegated ) return this.delegated;

    ev( window ).on( 'resize', this.debouncedResize );

    this.delegated = true;
    return this.delegated;
  };

  // render helpers

  AnnotationBubbleWrapperView.prototype.navigateToAnnotation = function () {
    this.iframe.src = crayon.helpers.routes.annotation_url( this.model.attributes.id );
  };

  AnnotationBubbleWrapperView.prototype.setPositionalCSS = function () {
    var boundingBox = this.parentView.getBounds();

    if ( boundingBox.top > HEIGHT - 20 ) {
      crayon.helpers.utility.removeClass( this.element, 'below' )
      crayon.helpers.utility.addClass( this.element, 'above' );
    } else {
      crayon.helpers.utility.removeClass( this.element, 'above' )
      crayon.helpers.utility.addClass( this.element, 'below' );
    }

    this.element.style.top = this._cssTopVal( boundingBox ) + 'px';
    this.element.style.left = this._cssLeftVal( boundingBox, this.parent ) + 'px';
    this.element.style.width = this._width() + 'px';

    return this.element;
  };

  // private

  // TODO: clean this mess up
  AnnotationBubbleWrapperView.prototype._cssLeftVal = function ( boundingBox, element ) {
    var xdiff, elementOffset, left, min, width;

    // get the center of the bounding box, from the left
    xdiff = ( boundingBox.right - boundingBox.left ) / 2;
    // get the parent element's offset from the left edge of the viewport
    elementOffset = element.getBoundingClientRect().left + element.offsetLeft;
    // setting the bubble to this min value would place the left edge of the
    // bubble 5px right of the left edge of the viewport
    min = elementOffset * -1 + 5;
    width = this._width();

    left = xdiff - ( width / 2 ) - element.offsetLeft;

    // check if the bubble would bleed off the right edge of the screen
    if ( elementOffset + left + width > this._windowWidth() ) {
      // ( this._windowWidth() - width - 5 ) would set the bubble just inside
      // the right edge, if the parent were the window itself. Subtract
      // the parent offset from this to get that same location for whereever
      // the parent is located relative to the viewport.
      left = this._windowWidth() - width - 5 - elementOffset
    }

    return min > left ? min : left;
  };

  AnnotationBubbleWrapperView.prototype._cssTopVal = function ( boundingBox ) {
    var topVal;

    // theory is that users would prefer the bubble to appear above the text
    // when possible, as this would not block continuing to read, so, we allow
    // the bubble to bleed off the top slightly, but not enough to obscure any
    // of the annotation. This coud be totally off base.
    if ( boundingBox.top > HEIGHT - 20 ) {
      // TODO: check node line height first?
      topVal = ( -1 * HEIGHT ) ;
    } else {
      topVal = boundingBox.bottom - boundingBox.top + 30;
    }

    return topVal;
  };

  AnnotationBubbleWrapperView.prototype._width = function () {
    if ( this._windowWidth() < MAX_WIDTH + 10 ) {
      return this._windowWidth() < MIN_WIDTH + 10 ? MIN_WIDTH : this._windowWidth() - 10;
    } else {
      return MAX_WIDTH;
    }
  };

  // for stubbing in tests
  AnnotationBubbleWrapperView.prototype._windowWidth = function () {
    return window.innerWidth;
  };

  AnnotationBubbleWrapperView.prototype._setParentOverflows = function () {
    var parent = this.parent.parentElement;

    while ( parent ) {
      if ( parent.style.overflowX !== 'scroll' ) parent.style.overflowX = 'visible';
      if ( parent.style.overflowY !== 'scroll' ) parent.style.overflowY = 'visible';

      parent = parent.parentElement;
    }
  };

  var assembleTemplate = function () {
    var wrapper, innerHTML;

    wrapper = document.createElement( 'span' );
    wrapper.id = AnnotationBubbleWrapperView.prototype.id;
    wrapper.className = AnnotationBubbleWrapperView.prototype.className;

    innerHTML = "<iframe></iframe>";

    wrapper.innerHTML = innerHTML;

    return wrapper;
  };

  return AnnotationBubbleWrapperView;

})();
