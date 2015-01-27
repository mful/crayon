describe( 'crayon.services.AnnotationInjector', function () {

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
    this.annotation = new crayon.models.Annotation( this.selection );
    this.injector = new crayon.services.AnnotationInjector( this.annotation, crayon.views.AnnotatedTextView );
  });

  afterEach( function () {
    document.body.removeChild( this.html );
  });

  describe( '#inject', function () {

    describe( 'when there are multiple valid locations for a given annotation', function () {
      it( 'should return a view for each valid location', function () {
        var testText = "Wes Anderson hashtag typewriter, synth McSweeney's viral kitsch.";
        expect( this.injector.inject(testText).length ).toEqual( 2 );
      });
    });

    describe( 'when there is a single valid location for a given annotation', function () {
      it( 'should return a single view in an array', function () {
        var testText = "Roof party deep v biodiesel meditation polaroid.";
        expect( this.injector.inject(testText).length ).toEqual( 1 );
      });
    });

    describe( 'when there are no valid locations for the given annotation', function () {
      it( 'should return an empty array', function () {
        var testText = "asdfasdfas asdfa sdf asdf";
        expect( this.injector.inject(testText) ).toEqual( [] );
      });
    });
  });

  describe( '#_createViews', function () {
    it( 'should return a list of views for each valid nodeSet', function () {
      var nodeSets = [
        [
          {node: this.pageNodes[2], matchStr: 'Wes Anderson hashtag typewriter'},
          {node: this.pageNodes[3], matchStr: ', '},
          {node: this.pageNodes[4], matchStr: 'synth '},
          {node: this.pageNodes[5], matchStr: "McSweeney's"},
          {node: this.pageNodes[6], matchStr: ' viral kitsch'},
          {node: this.pageNodes[7], matchStr: '.'}
        ],
        null
      ]

      expect( this.injector._createViews(nodeSets).length ).toEqual(1);
    });
  });

  describe( '#_getDOMNodesFromText', function () {

    describe( 'when no nodes match the given text', function () {
      it( 'should return an empty array', function () {
        var text = "lul lets seeeeee it";
        expect( this.injector._getDOMNodesFromText(text) ).toEqual( [] );
      });
    });

    describe( 'when several nodes match the given text', function () {
      it( 'should return a list of those nodes', function () {
        var text = 'Wes Anderson hashtag';
        var expectedResult = [this.pageNodes[2], this.pageNodes[12], this.pageNodes[16]];
        expect( this.injector._getDOMNodesFromText(text) ).toEqual( expectedResult );
      });
    });

    describe( 'when a single node matches the given text', function () {
      it( 'should return an array with only one result', function () {
        var text = 'Roof party deep v biodiesel meditation polaroid.';
        var expectedResult = [this.pageNodes[0]];
        expect( this.injector._getDOMNodesFromText(text) ).toEqual( expectedResult );
      });
    });
  });

  describe( '#_getNodeSet', function () {

    describe( 'when given a valid candidate', function () {
      it( 'should return a nodeSet', function () {
        var candidate = {node: this.pageNodes[2], matchStr: 'Wes Anderson hashtag typewriter'};
        var matchStr = ", synth McSweeney's viral kitsch.";
        var expectedResult = [
          {node: this.pageNodes[2], matchStr: 'Wes Anderson hashtag typewriter'},
          {node: this.pageNodes[3], matchStr: ', '},
          {node: this.pageNodes[4], matchStr: 'synth '},
          {node: this.pageNodes[5], matchStr: "McSweeney's"},
          {node: this.pageNodes[6], matchStr: ' viral kitsch'},
          {node: this.pageNodes[7], matchStr: '.'}
        ];

        expect( this.injector._getNodeSet([candidate], this.pageNodes, matchStr, '') ).toEqual( expectedResult );
      });
    });

    describe( 'when given an invalid candidate', function () {
      it( 'should return null', function () {
        var candidate = {node: this.pageNodes[12], matchStr: 'Wes Anderson hashtag typewriter'};
        var matchStr = ", synth McSweeney's viral kitsch.";
        var expectedResult = null;

        expect( this.injector._getNodeSet([candidate], this.pageNodes, matchStr, '') ).toEqual( expectedResult );
      });
    });
  });

  describe( '#_lastMatchStr', function () {
    it( 'should return a matchStr, minus already matched text', function () {
      var candidates = [
        {node: this.pageNodes[2], matchStr: 'Wes Anderson hashtag typewriter'},
        {node: this.pageNodes[3], matchStr: ', '},
        {node: this.pageNodes[4], matchStr: 'synth '},
        {node: this.pageNodes[5], matchStr: "McSweeney's"},
        {node: this.pageNodes[6], matchStr: ' viral kitsch'}
      ];
      var expectedResult = '.';
      var matchStr = ", synth McSweeney's viral kitsch.";

      expect( this.injector._lastMatchStr(candidates, matchStr) ).toEqual( expectedResult );
    });
  });

  describe( '#_nodeCheckRegex', function () {
    it( 'should a regex for the given text, with all special chars escaped, and a start-of-string char prepended', function () {
      var text = "This is-/(the)\\ story of a ^$*girl +?.|[]{}";
      var expectedResult = /^This is\-\/\(the\)\\ story of a \^\$\*girl \+\?\.\|\[\]\{\}/;
      expect( this.injector._nodeCheckRegex(text) ).toEqual( expectedResult );
    });
  });

  describe( '#_nodeSets', function () {

    describe( 'when no candidates are valid', function () {
      it( 'should return a list of nulls', function () {
        var candidates = [this.pageNodes[0]];
        var testText = 'Roof party deep v biodiesel meditation polaroid.';
        var matchStr = ", synth McSweeney's viral kitsch.";

        expect( this.injector._nodeSets(candidates, testText, matchStr) ).toEqual( [null] );
      });
    });

    describe( 'when some candidates have valid matches in the document', function () {
      it( 'should return a list of nodeSets for valid matches, and nulls for invalid candidates', function () {
        var candidates = [this.pageNodes[2], this.pageNodes[12]];
        var testText = 'Wes Anderson hashtag typewriter';
        var matchStr = ", synth McSweeney's viral kitsch.";
        var expectedResults = [
          [
            {node: candidates[0], matchStr: testText},
            {node: this.pageNodes[3], matchStr: ', '},
            {node: this.pageNodes[4], matchStr: 'synth '},
            {node: this.pageNodes[5], matchStr: "McSweeney's"},
            {node: this.pageNodes[6], matchStr: ' viral kitsch'},
            {node: this.pageNodes[7], matchStr: '.'}
          ],
          null
        ];

        expect( this.injector._nodeSets(candidates, testText, matchStr) ).toEqual( expectedResults );
      });
    });

    describe( 'when all candidates have valid matches in the document', function () {
      it( 'should return a list of nodeSets', function () {
        var candidates = [this.pageNodes[2]];
        var testText = 'Wes Anderson hashtag typewriter';
        var matchStr = ", synth McSweeney's viral kitsch.";
        var expectedResults = [
          [
            {node: candidates[0], matchStr: testText},
            {node: this.pageNodes[3], matchStr: ', '},
            {node: this.pageNodes[4], matchStr: 'synth '},
            {node: this.pageNodes[5], matchStr: "McSweeney's"},
            {node: this.pageNodes[6], matchStr: ' viral kitsch'},
            {node: this.pageNodes[7], matchStr: '.'}
          ]
        ];

        expect( this.injector._nodeSets(candidates, testText, matchStr) ).toEqual( expectedResults );
      });
    });
  });

  describe( '#_processRawResults', function () {

    describe( 'when there is no more text to match against', function () {
      it( 'should return all rawResults, properly formatted', function () {
        var results = [this.pageNodes[0]];
        var testText = 'Roof party deep v biodiesel meditation polaroid.';
        var expectedResults = [
          [{node: results[0], matchStr: testText}]
        ];

        expect( this.injector._processRawResults(results, testText, []) ).toEqual( expectedResults );
      });
    });

    describe( 'when there is more text left to match', function () {
      it( 'should return only the matching rawResults, properly formatted, with following nodes', function () {
        var results = [this.pageNodes[2], this.pageNodes[12], this.pageNodes[16]];
        var testText = 'Wes Anderson hashtag typewriter';
        var leftovers = [', ', 'synth ', "McSweeney's ", 'viral ', 'kitsch.'];
        var expectedResults = [
          [
            {node: results[0], matchStr: testText},
            {node: this.pageNodes[3], matchStr: ', '},
            {node: this.pageNodes[4], matchStr: 'synth '},
            {node: this.pageNodes[5], matchStr: "McSweeney's"},
            {node: this.pageNodes[6], matchStr: ' viral kitsch'},
            {node: this.pageNodes[7], matchStr: '.'}
          ],
          null
        ];

        expect( this.injector._processRawResults(results, testText, leftovers) ).toEqual( expectedResults );
      });
    });
  });

  describe( '#_pruneResults', function () {
    var testText = 'Wes Anderson hashtag typewriter';

    it( 'should only return nodes that end with the matchText', function () {
      var candidates = [this.pageNodes[2], this.pageNodes[12], this.pageNodes[16]];
      var expectedNodes = [this.pageNodes[2], this.pageNodes[12]];

      expect( this.injector._pruneResults(candidates, testText) ).toEqual( expectedNodes );
    });
  });

  describe( '#_rawResults', function () {
    var testText = 'Wes Anderson hashtag';

    describe( 'when none of the found nodes have already been checked', function () {
      it( 'should return all of the found nodes', function () {
        var candidates = [];
        var expectedNodes = [this.pageNodes[2], this.pageNodes[12], this.pageNodes[16]];

        expect( this.injector._rawResults( testText,  candidates) ).toEqual( expectedNodes );
      });
    });

    describe( 'when some of the found nodes have already been checked', function () {
      it( 'should return all of the found nodes', function () {
        var candidates = [this.pageNodes[12]];
        var expectedNodes = [this.pageNodes[2], this.pageNodes[16]];

        expect( this.injector._rawResults( testText,  candidates) ).toEqual( expectedNodes );
      });
    });

    describe( 'when all of the found nodes have already been checked', function () {
      it( 'should return all of the found nodes', function () {
        var candidates = [this.pageNodes[2], this.pageNodes[12], this.pageNodes[16]];
        var expectedNodes = [];

        expect( this.injector._rawResults( testText,  candidates) ).toEqual( expectedNodes );
      });
    });
  });

  // Cases to cover:
  //   - selection in single node
  //   - selection crosses sibling nodes
  //   ---- include crossing headers (no punct)
  //   - selection contains nested nodes
  //   - selection ends in partially nested node
  //   - child node followed by punctuation
  //   - ...definitely more I haven't thought of...
  var initializeHTML = function () {
    var element = document.createElement( 'div' );
    element.innerHTML = "Roof party deep v biodiesel meditation polaroid. " +
      "<h2>Lomo Blue Bottle gluten-free</h2>" +
      "<a>Wes Anderson hashtag typewriter</a>" +
      ", <span>synth <strong>McSweeney's</strong> viral kitsch</span>." +
      "<p id='split-p'>Ennui craft beer <a>flexitarian stumptown. Scenester Williamsburg letterpress.</a> </p>" +
      "<p>Keffiyeh umami fixie, DIY literally heirloom you probably haven't heard of them.</p>" +
      "<a>Wes Anderson hashtag typewriter</a>, <strong>synth </strong>" +
      "Lo-fi XOXO hoodie, plaid slow-carb fap Tumblr Intelligentsia VHS." +
      "<a>Wes Anderson hashtag typewriter, synth McSweeney's viral kitsch</a>."

    return element;
  };
});
