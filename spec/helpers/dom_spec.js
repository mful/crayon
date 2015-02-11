describe( 'crayon.helpers.dom', function () {

  beforeEach( function () {
    this.helper = crayon.helpers.dom;
  });

  describe( '#isChildOf', function () {

    beforeEach( function () {
      this.parent = document.createElement( 'div' );
      this.parent.innerHTML = '<span></span>';
      this.child = document.createElement( 'p' );
      this.parent.querySelector( 'span' ).appendChild( this.child );
      this.orphan = document.createElement( 'h1' )
    });

    describe( 'when the proposed child can be traced back to the parent', function () {
      it( 'should return true', function () {
        expect( this.helper.isChildOf(this.parent, this.child) ).toEqual( true );
      });
    });

    describe( 'when the proposed child is not a descendant of the parent', function () {
      it( 'should return false', function () {
        expect( this.helper.isChildOf(this.parent, this.orphan) ).toEqual( false );
      });
    });
  });

  describe( '#getBaseTextNodes', function () {
    beforeEach( function () {
      this.html = document.createElement( 'div' );
      this.html.innerHTML = "Roof party deep v biodiesel meditation polaroid. " +
        "<a>Wes Anderson hashtag typewriter</a>" +
        ", <span>synth <strong>McSweeney's</strong> viral kitsch</span>" +
        "<p id='split-p'>ennui craft beer flexitarian stumptown scenester Williamsburg letterpress. </p>" +
        "<p>Keffiyeh umami fixie, DIY literally heirloom you probably haven't heard of them.</p>"
      this.expectedTextNodesContent = [
        "Roof party deep v biodiesel meditation polaroid. ",
        "Wes Anderson hashtag typewriter",
        ", ",
        "synth ",
        "McSweeney's",
        " viral kitsch",
        "ennui craft beer flexitarian stumptown scenester Williamsburg letterpress. ",
        "Keffiyeh umami fixie, DIY literally heirloom you probably haven't heard of them."
      ]

      this.html.querySelector('#split-p').firstChild.splitText( 17 );
      this.results = []
      crayon.helpers.dom.getBaseTextNodes( this.html, this.results );
    });

    afterEach( function () {
      delete this.html;
      delete this.results;
    });

    it( 'should return the expected number of results', function () {
      expect( this.results.length ).toEqual( this.expectedTextNodesContent.length );
    });

    it( 'should return only text nodes', function () {
      var allTextNodes = true;

      for ( var i = 0; i < this.results.length; i++ ) {
        if ( this.results[i].nodeType !== 3 ) {
          allTextNodes = false;
          break;
        }
      }

      expect( allTextNodes ).toEqual( true );
    });

    it( 'should return the expected nodes', function () {
      for ( var i = 0; i < this.results.length; i++ ) {
        expect( this.results[i].textContent ).toEqual( this.expectedTextNodesContent[i] );
      }
    });
  });
});
