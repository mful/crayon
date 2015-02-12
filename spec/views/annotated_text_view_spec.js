describe( 'crayon.views.AnnotatedTextView', function () {

  beforeEach( function () {
    this.html = initializeHTML();
    document.body.appendChild( this.html );

    this.selection = {
      rangeCount: 1,
      toString: function () {
        return "We are not descended from fearful me";
      },
      getRangeAt: function ( i ) {
        return {
          commonAncestorContainer: { textContent: 'Edward Murrow murrow murrow. We are not descended from fearful men.   ' }
        }
      }
    };

    this.pageNodes = [];
    crayon.helpers.dom.getBaseTextNodes( this.html, this.pageNodes );

    spyOn( crayon.helpers.url, 'currentHref' ).and.returnValue( 'https://hogwarts.com' );
    this.annotation = crayon.models.Annotation.createFromSelection( this.selection );

    this.nodes = [
      {node: this.pageNodes[2], matchStr: 'Wes Anderson hashtag typewriter'},
      {node: this.pageNodes[3], matchStr: ', '},
      {node: this.pageNodes[4], matchStr: 'synth '},
      {node: this.pageNodes[5], matchStr: "McSweeney's"},
      {node: this.pageNodes[6], matchStr: ' viral kitsch'},
      {node: this.pageNodes[7], matchStr: '.'}
    ];

    this.view = new crayon.views.AnnotatedTextView( this.annotation, this.nodes );
  });

  describe( '#setActive', function () {

    beforeEach( function () {
      this.view.render();
      spyOn( crayon.helpers.utility, 'addClass' );
      spyOn( crayon.helpers.utility, 'removeClass' );
    });

    afterEach( function () {
      this.view.remove();
    });

    describe( 'when activating the annotated view', function () {
      it( 'should add the class', function () {
        this.view.setActive( true );
        expect( crayon.helpers.utility.addClass.calls.count() ).toEqual( this.nodes.length );
      });
    });

    describe( 'when deactivating a view', function () {
      it( 'should remove the class', function () {
        this.view.active = true;
        this.view.setActive( false );
        expect( crayon.helpers.utility.removeClass.calls.count() ).toEqual( this.nodes.length );
      });
    });
  });

  describe( '#_boundingCoordinates', function () {

    beforeEach( function () {
      this.mockEl = document.createElement( 'div' );
      this.wideDiv = document.createElement( 'div' );
      this.tallDiv = document.createElement( 'div' );

      this.wideDiv.style.height = '1px';
      this.wideDiv.style.width  = '100%';
      this.tallDiv.style.height = '100%';
      this.tallDiv.style.width  = '1px';

      this.mockEl.appendChild( this.wideDiv );
      this.mockEl.appendChild( this.tallDiv );

      document.body.appendChild( this.mockEl );
    });

    afterEach( function () {
      document.body.removeChild( this.mockEl );
    });

    it( 'should return the bounding rectangle of the elements', function () {
      var wideRect = this.wideDiv.getBoundingClientRect();
      var tallRect = this.tallDiv.getBoundingClientRect();
      var expectedRes = {
        left: wideRect.left,
        right: wideRect.right,
        top: tallRect.top,
        bottom: tallRect.bottom
      }

      expect( this.view._boundingCoordinates([this.wideDiv, this.tallDiv]) );
    });
  });

  describe( '#_createModifiedNode', function () {

    describe( 'when there is only one node in the set', function () {
      it( 'should wrap the appropriate part of the node in a span', function () {
        var nodeData = {
          node: this.pageNodes[15],
          matchStr: 'VHS.'
        }
        res = this.view._createModifiedNode(nodeData, true, true);
        expect( res.childNodes.length ).toEqual(2);
        expect( res.childNodes[0].nodeType ).toEqual( 3 );
        expect( res.childNodes[1].nodeType ).toEqual( 1 );
        expect( res.childNodes[1].textContent ).toEqual( 'VHS.' );
      })
    });

    describe( 'when given the first node of the set', function () {
      it( 'should wrap the text starting with the match string, to the end of the node in a span', function () {
        var nodeData = {
          node: this.pageNodes[2],
          matchStr: 'Anderson hashtag'
        }
        res = this.view._createModifiedNode(nodeData, true, false);
        expect( res.childNodes.length ).toEqual(2);
        expect( res.childNodes[0].nodeType ).toEqual( 3 );
        expect( res.childNodes[1].nodeType ).toEqual( 1 );
        expect( res.childNodes[1].textContent ).toEqual( 'Anderson hashtag typewriter' );
      })
    });

    describe( 'when given the last node of the set', function () {
      it( 'should wrap the text starting at the beginning of the node, to the end of the match string', function () {
        var nodeData = {
          node: this.pageNodes[2],
          matchStr: 'Anderson hashtag'
        }
        res = this.view._createModifiedNode(nodeData, false, true);
        expect( res.childNodes.length ).toEqual(2);
        expect( res.childNodes[0].nodeType ).toEqual( 1 );
        expect( res.childNodes[1].nodeType ).toEqual( 3 );
        expect( res.childNodes[0].textContent ).toEqual( 'Wes Anderson hashtag' );
      })
    });

    describe( 'when given a middle node, in the set', function () {
      it( 'should wrap all text in the node', function () {
        var nodeData = {
          node: this.pageNodes[2],
          matchStr: 'Anderson hashtag'
        }
        res = this.view._createModifiedNode(nodeData, false, false);
        expect( res.childNodes.length ).toEqual(1);
        expect( res.childNodes[0].nodeType ).toEqual( 1 );
        expect( res.childNodes[0].textContent ).toEqual( 'Wes Anderson hashtag typewriter' );
      })
    });
  });

  var initializeHTML = function () {
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

    return element;
  };
});
