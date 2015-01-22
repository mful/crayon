describe( 'this.helper', function () {

  beforeEach( function () {
    this.helper = crayon.helpers.utility;
  });

  describe( '#addClass', function () {
    beforeEach( function () {
      this.element = document.createElement('div')
      this.element.className = 'test-me out now-pls'
      this.originalClassName = this.element.className;
    });

    afterEach( function () {
      delete this.element;
    });

    describe( 'when the class already exists', function () {
      beforeEach( function () {
        this.helper.addClass( this.element, 'out' )
      });

      it( 'should change nothing', function () {
        expect( this.element.className ).toEqual( this.originalClassName );
      })
    })

    describe( 'when the class does not already exist', function () {
      beforeEach( function () {
        this.helper.addClass( this.element, 'magic-class' )
      });

      it( 'should add the new class', function () {
        expect( this.element.className ).toEqual( this.originalClassName + ' magic-class' );
      });
    })
  });

  describe( '#isBlank', function () {

    describe( 'when the given string is null', function () {
      it( 'should return true', function () {
        expect( this.helper.isBlank( null ) ).toEqual( true );
      });
    });

    describe( 'when the given string is whitespace', function () {
      it( 'should return true', function () {
        expect( this.helper.isBlank( '    ' ) ).toEqual( true );
      });
    });

    describe( 'when the given string is valid', function () {
      it( 'should return false', function () {
        expect( this.helper.isBlank( 'A string!' ) ).toEqual( false );
      });
    });
  });

  describe( '#isContained', function () {
    var parent = 'This is the story of a girl, who cried a river and drowned the whole world';

    describe( 'when the child is contained in the parent', function () {
      it( 'should return true', function () {
        var child = 'story of a girl';
        expect( this.helper.isContained(parent, child) ).toEqual( true );
      });
    });

    describe( 'when the child is not fully contained in the parent', function () {
      it( 'should return false', function () {
        var child = 'and drowned the whole world And while she looks so sad in photographs';
        expect( this.helper.isContained(parent, child) ).toEqual( false );
      });
    });
  });

  describe( '#regexEscape', function () {
    it( 'should escape all special characters', function () {
      var text = "This is-/(the)\\ story of a ^$*girl +?.|[]{}";
      var expectedResult = "This is\\-\\/\\(the\\)\\\\ story of a \\^\\$\\*girl \\+\\?\\.\\|\\[\\]\\{\\}";
      expect( this.helper.regexEscape(text) ).toEqual( expectedResult );
    });
  });

  describe( '#removeClass', function () {
    beforeEach( function () {
      this.element = document.createElement('div')
      this.element.className = 'test-me out now-pls'
      this.originalClassName = this.element.className;
    });

    afterEach( function () {
      delete this.element;
    });

    describe( 'when the class is not applied to the element', function () {
      beforeEach( function () {
        this.helper.removeClass( this.element, 'magic-class' );
      });

      it( 'should not change the className of the element', function () {
        expect( this.element.className ).toEqual( this.originalClassName );
      });
    });

    describe( 'when the class is applied to the element', function () {
      it( 'should remove the class when it is the first class', function () {
        this.helper.removeClass( this.element, 'test-me' );
        expect( this.element.className ).toEqual(' out now-pls');
      });

      it( 'should remove the class when it is the last class', function () {
        this.helper.removeClass( this.element, 'now-pls' );
        expect( this.element.className ).toEqual('test-me out');
      });

      it( 'should remove the class when it is a class in the middle of the className', function () {
        this.helper.removeClass( this.element, 'out' );
        expect( this.element.className ).toEqual('test-me now-pls');
      });
    });
  });

  describe( '#separateSentences', function () {
    var text = "Harry Potter and the Sorcerer's Stone\vBy JK Rowling\fChapter 2.4:\nThe Boy Who Lived\r1 day, long ago?    Another test! $5 we go. (Well well well) this is interesting.";
    var expectedResult = [
      "Harry Potter and the Sorcerer's Stone\v",
      "By JK Rowling\f",
      "Chapter 2.4:\n",
      "The Boy Who Lived\r",
      "1 day, long ago?    ",
      "Another test! ",
      "$5 we go. ",
      "(Well well well) this is interesting."
    ]

    it( 'should split up the text as expected', function () {
      expect( this.helper.separateSentences(text) ).toEqual( expectedResult );
    });
  });
});
