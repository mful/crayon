describe( 'crayon.models.Annotation', function () {

  beforeEach( function () {
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

    spyOn( crayon.helpers.url, 'currentHref' ).and.returnValue( 'https://hogwarts.com' );
    this.annotation = crayon.models.Annotation.createFromSelection( this.selection );
  });

  afterEach( function () {
    delete this.annotation;
  });

  describe( '.createFromSelection', function () {
    it( 'should create an annotation with the expected attributes', function () {
      var result = crayon.models.Annotation.createFromSelection( this.selection );
      expect( result.attributes ).toEqual({ text: 'We are not descended from fearful men.', url: 'https://hogwarts.com' });
    });
  });

  describe( '.fetchAllForPage', function () {

    describe( 'when there is a network error', function () {
      beforeEach( function () {
        spyOn( crayon.helpers.xhr, 'get' ).and.callFake( function ( path, callback ) {
          return callback( true, undefined );
        });

        this.callback = function( list ) {}

        spyOn( this, 'callback' );

        crayon.models.Annotation.fetchAllForPage('http://hogwarts.com', this.callback)
      });

      it( 'should return an empty array', function () {
        expect( this.callback ).toHaveBeenCalledWith( [] );
      });
    });

    describe( 'when the page has annotations', function () {
      beforeEach( function () {
        var _this = this;
        this.annotations = [{text: 'some text', url: 'lego.com'}, {text: 'test test test', url: 'lego.com'}]

        spyOn( crayon.helpers.xhr, 'get' ).and.callFake( function ( path, callback ) {
          return callback( false, {data: {annotations: _this.annotations}} );
        });

        this.callback = function( list ) {}

        spyOn( this, 'callback' );

        crayon.models.Annotation.fetchAllForPage('http://hogwarts.com', this.callback)
      });

      it( 'should return an Annotation instance for each associated with the page', function () {
        expect( this.callback ).toHaveBeenCalledWith(
          [
            jasmine.objectContaining({
              attributes: {text: 'some text', url: 'lego.com'}
            }),
            jasmine.objectContaining({
              attributes: {text: 'test test test', url: 'lego.com'}
            })
          ]
        );
      });
    });

    describe( 'when the page has no annotations', function () {
      beforeEach( function () {
        spyOn( crayon.helpers.xhr, 'get' ).and.callFake( function ( path, callback ) {
          return callback( false, {data: {annotations: []}} );
        });

        this.callback = function( list ) {}

        spyOn( this, 'callback' );

        crayon.models.Annotation.fetchAllForPage('http://hogwarts.com', this.callback)
      });

      it( 'should return an empty array', function () {
        expect( this.callback ).toHaveBeenCalledWith( [] );
      });
    });
  });

  describe( '#parseText', function () {

    // one, sweeping integration test
    describe( 'when given a complex, but otherwise valid selection', function () {
      beforeEach( function () {
        var p1, p2, div;

        p1 = document.createElement( 'p' );
        p1.innerHTML = "There’s a reason why the Panthers have that space: They haven’t done anything about Greg Hardy. Carolina would have had about <a href=\"http://espn.go.com/blog/carolina-panthers/post/_/id/5080/a-closer-look-at-carolinas-salary-cap-room\" target=\"_blank\"><span>$18 million in cap space last offseason</span></a> if it&nbsp;hadn’t franchised Hardy for $13.1 million, a move that&nbsp;ended up turning into a disaster for reasons out of Carolina’s control. Hardy’s domestic assault conviction eventually led the team to put him on the commissioner’s exempt list, which didn’t occur until after the season had begun. Had the Panthers known what was going to happen with Hardy, of course, they could have used that cap space elsewhere.<a class\"footnote-link\" data-footnote-id=\"1\" href=\"#fn-1\"><sup id=\"ss-1\">1</sup></a>";

        p2 = document.createElement( 'p' );
        p2.innerHTML = "A long-term, or even short-term, deal for Hardy would eat up most of that cap space, but it seems likely that the Panthers will let their star pass-rusher leave. That makes the $11.1 million figure look less exciting, because it leaves the Panthers with yet another hole to fill. Pass-rushers hardly come cheap on the free market, so it seems likely that Carolina would use the draft to target one (or rely more heavily on 2014 second-rounder Kony Ealy) while using free agency to target upgrades elsewhere.";

        div = document.createElement( 'div' );
        div.appendChild( p1 );
        div.appendChild( p2 );

        document.body.appendChild( div );

        this.complexSelection = {
          rangeCount: 1,
          toString: function () {
            return " offseason if it hadn’t franchised Hardy for $13.1 million, a move that ended up turning into a disaster for reasons out of Carolina’s control. Hardy’s domestic assault conviction eventually led the team to put him on the commissioner’s exempt list, which didn’t occur until after the season had begun. Had the Panthers known what was going to happen with Hardy, of course, they could have used that cap space elsewhere.1A long-term, or even short-";
          },
          getRangeAt: function ( i ) {
            return {
              commonAncestorContainer: div
            }
          }
        };

        this.mockDiv = div;

        this.expectedResult = "Carolina would have had about $18 million in cap space last offseason if it hadn’t franchised Hardy for $13.1 million, a move that ended up turning into a disaster for reasons out of Carolina’s control. Hardy’s domestic assault conviction eventually led the team to put him on the commissioner’s exempt list, which didn’t occur until after the season had begun. Had the Panthers known what was going to happen with Hardy, of course, they could have used that cap space elsewhere.1A long-term, or even short-term, deal for Hardy would eat up most of that cap space, but it seems likely that the Panthers will let their star pass-rusher leave.";
      });

      afterEach( function () {
        delete this.complexSelection;
        document.body.removeChild( this.mockDiv );
      });

      it( 'should return the expected text', function () {
        expect( this.annotation.parseText(this.complexSelection) ).toEqual( this.expectedResult );
      });
    });

    describe( 'when given a collapsed selection', function () {
      it( 'should return a blank string', function () {
        var selection = {isCollapsed: true};
        expect( this.annotation.parseText(selection) ).toEqual( '' );
      });
    });

    describe( 'when given a selection without ranges', function () {
      it( 'should return a blank string', function () {
        var selection = {isCollapsed: false, rangeCount: 0};
        expect( this.annotation.parseText(selection) ).toEqual( '' );
      });
    });

    describe( 'when not given valid text', function () {
      it( 'should return a blank string', function () {
        var selection = {
          rangeCount: 1,
          toString: function () {
            return 'descended';
          },
          getRangeAt: function ( i ) {
            return {
              commonAncestorContainer: { textContent: 'This is a test descended test test test.' }
            }
          }
        };
        expect( this.annotation.parseText(selection) ).toEqual( '' );
      });
    });

  });

  describe( '#toQueryStr', function() {
    it( 'should serialize the annotation text and page url', function () {
      expect( this.annotation.toQueryStr() ).toEqual( 'text=We%20are%20not%20descended%20from%20fearful%20men.&url=https%3A%2F%2Fhogwarts.com' )
    })
  });

  describe( '#_assembleAnnotationSentences', function () {
    var selecteds = [
      'descended from fearful men.',
      ' That was said by'
    ];
    var completes = [
      "Some say that we are descended from fearful men.",
      " Others say otherwise.",
      "We are not descended from fearful men.",
      " That was said by Edward Murrow."
    ]
    var expecteds = [completes[2], completes[3]]

    it( 'should return the correct sentences, from the fragments', function () {
      expect( this.annotation._assembleAnnotationSentences(selecteds, completes) ).toEqual(expecteds);
    });
  });

  describe( '#_matchesSelection', function () {
    var selecteds = [
      'descended from fearful men.',
      ' That was said by'
    ];
    var completes = [
      "Some say that we are descended from fearful men.",
      " Others say otherwise.",
      "We are not descended from fearful men.",
      " That was said by Edward Murrow."
    ]

    describe( 'when the fragment is contained in the parent', function () {

      describe( 'and the next sentence matches the next fragment', function () {
        it( 'should return true', function () {
          expect( this.annotation._matchesSelection(selecteds, 0, completes, 2) ).toEqual( true )
        });
      });

      describe( 'but the next sentence does NOT match the next fragment', function () {
        it( 'should return false', function () {
          expect( this.annotation._matchesSelection(selecteds, 0, completes, 0) ).toEqual( false )
        });
      });

      describe( 'and it is the last fragment to check', function () {
        it( 'should return true', function () {
          expect( this.annotation._matchesSelection(selecteds, 1, completes, 3) ).toEqual( true )
        })
      });
    });

    describe( 'when the fragment is not contained in the parent', function () {
      it( 'should return false', function () {
        expect( this.annotation._matchesSelection(selecteds, 0, completes, 1) ).toEqual( false )
      });
    });
  });

  describe( '#_pruneSentences', function () {

    describe( 'when given an empty array', function () {
      it( 'should return an empty array', function () {
        expect( this.annotation._pruneSentences([]) ).toEqual( [] );
      });
    });

    describe( 'when given a singled element array', function () {
      describe( 'with a valid fragment', function () {
        it( 'should return the given array', function () {
          expect( this.annotation._pruneSentences(['This is a sentence. ']) ).toEqual( ['This is a sentence. '] );
        });
      });

      describe( 'with a fragment that should be pruned', function () {
        it( 'should return an empty array', function () {
          expect( this.annotation._pruneSentences(['This is ']) ).toEqual( [] );
        });
      });
    });

    describe( 'when given a multi-element array', function () {
      describe( 'when both the first and the last elements should be pruned', function () {
        it( 'should return the array without the first and last elements', function () {
          expect( this.annotation._pruneSentences(['okay.', 'A real sentence.', ' This is ']) ).toEqual( ['A real sentence.'] );
        })
      });

      describe( 'when no elements should be pruned', function () {
        it( 'should return the given array', function () {
          expect( this.annotation._pruneSentences(['This is a sentence. ', 'And so is this.']) ).toEqual( ['This is a sentence. ', 'And so is this.'] );
        })
      });
    });
  });

  describe( '#_shouldBePruned', function () {

    describe( 'when the text is too short', function () {
      describe( 'but is a sentence', function () {
        it( 'should return false', function () {
          var text = 'Stupify!'
          expect( this.annotation._shouldBePruned( text ) ).toEqual( false );
        });
      });

      describe( 'and is NOT a sentence', function () {
        it( 'should return true', function () {
          var text = 'Stupify'
          expect( this.annotation._shouldBePruned( text ) ).toEqual( true );
        });
      });
    });

    describe( 'when the text is NOT too short', function () {
      it( 'should return false', function () {
        var text = 'He who must not be named'
        expect( this.annotation._shouldBePruned( text ) ).toEqual( false );
      });
    });
  });

});
