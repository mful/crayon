describe( 'crayon.helpers.selection', function () {

  beforeEach( function () {
    this.helper = crayon.helpers.selection;
  });

  // one sweeping integration test
  describe( '#getSelectedParentNode', function () {

    beforeEach( function () {
      var _this = this;

      this.expectedNode = {
        textContent: 'If we look deep in our history and our doctrine, rememember: We are not descended from fearul men.'
      };

      this.selection = {
        rangeCount: 1,
        toString: function () {
          return ' are not descended from fearful men.  '
        },
        getRangeAt: function ( i ){
          return {
            commonAncestorContainer: {
              textContent: ' are not descended from fearful men.  ',
              parentNode: _this.expectedNode
            }
          };
        }
      };
    });

    afterEach( function () {
      delete this.selection;
    });

    it( 'should return the expected node', function () {
      expect( this.helper.getSelectedParentNode( this.selection ) ).toEqual( this.expectedNode )
    });
  });

  describe( '#isSuitableParent', function () {

    describe( 'when the selected text is contained in the parent before the last sentence', function () {
      it( 'should return true', function () {
        var parent = "This is a parent text node. This node ends in a footnote widget. See it here.1";
        var selection = "is a parent text node. This node ends in a footnote"

        expect( this.helper.isSuitableParent(parent, selection) ).toEqual( true );
      });
    });

    describe( 'when the selected text matches the last sentence of the parent', function () {
      describe( 'and the last sentence is a valid sentence', function () {
        it( 'should return true', function () {
          var parent = "This is a parent text node. This node does not end in a footnote widget.";
          var selection = "is a parent text node. This node ends in a footnote"

          expect( this.helper.isSuitableParent(parent, selection) ).toEqual( true );
        });
      });

      describe( 'and the last sentence is not a valid sentence', function () {
        it( 'should return true', function () {
          var parent = "This is a parent text node. This node does not end in a footnote wid";
          var selection = "is a parent text node. This node ends in a footnote"

          expect( this.helper.isSuitableParent(parent, selection) ).toEqual( false );
        });
      });
    });
  });

  describe( '#isSentenceCompliant', function () {

    // all valid ending characters tested in this block
    describe( 'when the text starts with a capital letter', function () {
      describe( 'and ends in a period', function () {
        it( 'should return true', function () {
          var text = ' Mr and Mrs Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal. Thank you very much.   '
          expect( this.helper.isSentenceCompliant(text) ).toEqual( true );
        });
      });

      describe( 'and ends in a question mark', function () {
        it( 'should return true', function () {
          var text = '  Mr and Mrs Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal. Thank you very much? '
          expect( this.helper.isSentenceCompliant(text) ).toEqual( true );
        });
      });

      describe( 'and ends in an exclamation point', function () {
        it( 'should return true', function () {
          var text = '  Mr and Mrs Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal. Thank you very much!'
          expect( this.helper.isSentenceCompliant(text) ).toEqual( true );
        });
      });

      describe( 'and ends in a newline character', function () {
        it( 'should return true', function () {
          var text = "Mr and Mrs Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal. Thank you very much\n"
          expect( this.helper.isSentenceCompliant(text) ).toEqual( true );
        });
      });

      describe( 'and ends in a carriage return character', function () {
        it( 'should return true', function () {
          var text = " Mr and Mrs Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal. Thank you very much\r"
          expect( this.helper.isSentenceCompliant(text) ).toEqual( true );
        });
      });

      describe( 'and ends in a vertical tab character', function () {
        it( 'should return true', function () {
          var text = " Mr and Mrs Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal. Thank you very much\v"
          expect( this.helper.isSentenceCompliant(text) ).toEqual( true );
        });
      });

      describe( 'and ends in a form feed character', function () {
        it( 'should return true', function () {
          var text = " Mr and Mrs Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal. Thank you very much\f"
          expect( this.helper.isSentenceCompliant(text) ).toEqual( true );
        });
      });

      describe( 'and ends in a non-terminating character', function () {
        it( 'should return true', function () {
          var text = " Mr and Mrs Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal. Thank you very much"
          expect( this.helper.isSentenceCompliant(text) ).toEqual( false );
        });
      });
    });

    describe( 'when the text starts with a digit, and ends with a finishing character', function () {
      it( 'should return true', function () {
        var text = "4, Privet Drive, were proud to say that they were perfectly normal. Thank you very much."
        expect( this.helper.isSentenceCompliant(text) ).toEqual( true );
      });
    });

    describe( 'when the text starts with a dollar sign, and ends with a finishing character', function () {
      it( 'should return true', function () {
        var text = "$4, Privet Drive, were proud to say that they were perfectly normal. Thank you very much."
        expect( this.helper.isSentenceCompliant(text) ).toEqual( true );
      });
    });

    describe( 'when the text starts with an open parenthesis, and ends with a finishing character', function () {
      it( 'should return true', function () {
        var text = "(4, Privet Drive) were proud to say that they were perfectly normal. Thank you very much."
        expect( this.helper.isSentenceCompliant(text) ).toEqual( true );
      });
    });

    describe( 'when the text starts with a lower case letter, and ends with a finishing character', function () {
      it( 'should return true', function () {
        var text = "mr and Mrs Dursley, of number four, Privet Drive were proud to say that they were perfectly normal. Thank you very much."
        expect( this.helper.isSentenceCompliant(text) ).toEqual( false );
      });
    });

    describe( 'when the text starts with a non-starting symbol, and ends with a finishing character', function () {
      it( 'should return true', function () {
        var text = "> Mr and Mrs Dursley, of number four, Privet Drive were proud to say that they were perfectly normal. Thank you very much."
        expect( this.helper.isSentenceCompliant(text) ).toEqual( false );
      });
    });
  });
});
