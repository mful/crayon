describe( 'crayon.views.AnnotationBubbleWrapperView', function () {

  beforeEach( function () {
    this.mockEl = initialize();
    this.view = {getBounds: function () {}};
    this.annotation = {attributes: {id: 1}};

    this.view = new crayon.views.AnnotationBubbleWrapperView({
      element: this.mockEl.querySelector( 'span' ),
      view: this.view,
      annotation: this.annotation
    });
  });

  afterEach( function () {
    document.body.removeChild( this.mockEl );
    delete this.view;
    delete this.annotation;
    delete this.view;
  });

  describe( '#navigateToAnnotation', function () {

    beforeEach( function () {
      this.view.navigateToAnnotation();
    });

    it( 'should set the iframe URL to the annotation URL', function () {
      var url = 'http://scribble.test/annotations/1'
      expect( this.view.iframe.src ).toEqual( url );
    });
  });

  describe( '#setPositionalCSS', function () {

    describe( 'when there is room for the bubble above the text', function () {
      beforeEach( function () {
        this.bounds = {
          left: 10,
          right: 100,
          top: 1000,
          bottom: 100000
        }
        spyOn( this.view.parentView, 'getBounds' ).and.returnValue( this.bounds )

        this.view.setPositionalCSS();
      });

      it( 'should set the below class on the element', function () {
        expect( !!this.view.element.className.match(/below/) ).toEqual( false );
        expect( !!this.view.element.className.match(/above/) ).toEqual( true );
      });

      it( 'should set the needed css properties', function () {
        var leftVal = this.view._cssLeftVal( this.bounds, this.view.parent ) + 'px';
        var topVal = this.view._cssTopVal( this.bounds ) + 'px';
        var widthVal = this.view._width() + 'px';

        expect( this.view.element.style.left ).toEqual( leftVal );
        expect( this.view.element.style.top ).toEqual( topVal );
        expect( this.view.element.style.width ).toEqual( widthVal );
      });
    });

    describe( 'where there is not room for the bubble above the text', function () {
      beforeEach( function () {
        this.bounds = {
          left: 10,
          right: 100,
          top: 10,
          bottom: 100
        }
        spyOn( this.view.parentView, 'getBounds' ).and.returnValue( this.bounds );

        this.view.setPositionalCSS();
      });

      it( 'should set the below class on the element', function () {
        expect( !!this.view.element.className.match(/below/) ).toEqual( true );
        expect( !!this.view.element.className.match(/above/) ).toEqual( false );
      });
    });
  });

  describe( '#_cssLeftVal', function () {
    describe( 'when the viewport is large enough to place the bubble directly centered on the text', function () {

      describe( 'and the parent element is heavily offset', function () {

        beforeEach( function () {
          this.bounds = {
            left: 280,
            right: 580,
            top: 10,
            bottom: 1000
          }
          this.element = {offsetLeft: 300, getBoundingClientRect: function () {}};
          spyOn( this.view, '_windowWidth' ).and.returnValue( 1000 );
          spyOn( this.element, 'getBoundingClientRect' ).and.returnValue({
            left: 280
          });
        });

        afterEach( function () {
          delete this.bounds;
          delete this.element;
        })

        it( 'should return the left value to center the bubble over the text block', function () {
          expect( this.view._cssLeftVal(this.bounds, this.element) ).toEqual( -531 );
        });
      })

      describe( 'but centering the bubble on the parent would push it offscreen to the right', function () {

        beforeEach( function () {
          this.bounds = {
            left: 500,
            right: 900,
            top: 10,
            bottom: 1000
          }
          this.element = {offsetLeft: 300, getBoundingClientRect: function () {}};
          spyOn( this.view, '_windowWidth' ).and.returnValue( 1000 );
          spyOn( this.element, 'getBoundingClientRect' ).and.returnValue({
            left: 500
          });
        });

        afterEach( function () {
          delete this.bounds;
          delete this.element;
        })

        it( 'should return the left value to center the bubble over the text block', function () {
          expect( this.view._cssLeftVal(this.bounds, this.element) ).toEqual( -567 );
        });
      });

      describe( 'and centering the bubble on the parent would push it offscreen to the left', function () {

        beforeEach( function () {
          this.bounds = {
            left: 200,
            right: 500,
            top: 10,
            bottom: 1000
          }
          this.element = {offsetLeft: 100, getBoundingClientRect: function () {}};
          spyOn( this.view, '_windowWidth' ).and.returnValue( 1000 );
          spyOn( this.element, 'getBoundingClientRect' ).and.returnValue({
            left: 200
          });
        });

        afterEach( function () {
          delete this.bounds;
          delete this.element;
        })

        it( 'should return the left value to center the bubble over the text block', function () {
          expect( this.view._cssLeftVal(this.bounds, this.element) ).toEqual( -295 );
        });
      });
    });

    describe( 'when the viewport is too small to fit the min width of the bubble', function () {

      beforeEach( function () {
        this.bounds = {
          left: 100,
          right: 400,
          top: 10,
          bottom: 1000
        }
        this.element = {offsetLeft: 0, getBoundingClientRect: function () {}};
        spyOn( this.view, '_windowWidth' ).and.returnValue( 500 );
        spyOn( this.element, 'getBoundingClientRect' ).and.returnValue({
          left: 100
        });
      });

      afterEach( function () {
        delete this.bounds;
        delete this.element;
      })

      it( 'should return a left value that will set the bubble on the left edge of the screen, with 5px padding', function () {
        expect( this.view._cssLeftVal(this.bounds, this.element) ).toEqual( -95 );
      });
    });
  });

  describe( '#_cssTopVal', function () {

    describe( 'when there is room for the bubble above the text', function () {
      var bounds = {top: 500, bottom: 600};

      it( 'should return the bubbles height times -1', function () {
        expect( this.view._cssTopVal(bounds) ).toEqual( -274 );
      });
    });

    describe( 'when there isnt quite room to show the whole bubble above the text', function () {
      var bounds = {top: 255, bottom: 600};

      it( 'should still return the bubbles height times -1, placing it above the text', function () {
        expect( this.view._cssTopVal(bounds) ).toEqual( -274 );
      });
    });

    describe( 'when there isnt room to the bubble above the text', function () {
      var bounds = {top: 200, bottom: 400};

      it( 'should set the top of the bubble below the text, with padding', function () {
        expect( this.view._cssTopVal(bounds) ).toEqual( 230 );
      });
    });
  });

  describe( '#_width', function () {
    describe( 'when the window is smaller than the max width of the bubble', function () {

      describe( 'but bigger than the min width', function () {

        beforeEach( function () {
          spyOn( this.view, '_windowWidth' ).and.returnValue( 700 );
        });

        it( 'should return the window width, less 10px for padding', function () {
          expect( this.view._width() ).toEqual( 690 );
        });
      });

      describe( 'and smaller than the min width', function () {

        beforeEach( function () {
          spyOn( this.view, '_windowWidth' ).and.returnValue( 500 );
        });

        it( 'should return the min width', function () {
          expect( this.view._width() ).toEqual( 572 );
        });
      });
    });

    describe( 'when the window is bigger than the bubble max width', function () {

      beforeEach( function () {
        spyOn( this.view, '_windowWidth' ).and.returnValue( 1000 );
      });

      it( 'should return the max width', function () {
        expect( this.view._width() ).toEqual( 762 );
      });
    });
  });

  var initialize = function () {
    var element = document.createElement( 'div' );
    element.innerHTML = "Roof party deep v biodiesel meditation polaroid. " +
      "<h2>Lomo Blue Bottle gluten-free</h2>" +
      "<a>Wes Anderson hashtag typewriter</a>" +
      ", <span>synth <strong>McSweeney's</strong> viral kitsch</span>." +
      "<p id='split-p'>Ennui craft beer <a>flexitarian stumptown. Scenester Williamsburg letterpress.</a> </p>" +
      "<p>Keffiyeh umami fixie, DIY literally heirloom you probably haven't heard of them.</p>" +
      "<a>Wes Anderson hashtag typewriter</a>, <strong>synth </strong>" +
      "Lo-fi XOXO hoodie, plaid slow-carb fap Tumblr Intelligentsia VHS. VHS." +
      "<a>Wes Anderson hashtag typewriter, synth McSweeney's viral kitsch</a>."

    document.body.appendChild( element );

    return element;
  };
});
