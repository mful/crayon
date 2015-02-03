describe( 'crayon.helpers.utility', function () {

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

  describe( '#compact', function () {

    describe( 'when the list contains no null or undefined elements', function () {
      it( 'should return the given list', function () {
        var list = [1 ,'test', 3];
        expect( this.helper.compact(list) ).toEqual( list );
      });
    });

    describe( 'when the list contains some null and undefined elements', function () {
      it( 'should return the given list minus any null or undefined elements', function () {
        var list = [undefined, 1 ,'test', null, 3];
        expect( this.helper.compact(list) ).toEqual( [1, 'test', 3] );
      });
    });

    describe( 'when the list contains ALL null and undefined elements', function () {
      it( 'should return an empty array', function () {
        var list = [undefined, null];
        expect( this.helper.compact(list) ).toEqual( [] );
      });
    });

    describe( 'when given an empty list', function () {
      it( 'should return an empty array', function () {
        var list = [];
        expect( this.helper.compact(list) ).toEqual( [] );
      });
    });
  });

  describe( '#debounce', function () {

    beforeEach( function () {
      this.func = function () { return true; };
      this.debouncedFunc = this.helper.debounce( this.func, 200 );

      spyOn( this, 'func' );
    });

    it('should only call the given function once per given interval', function () {
      var _this = this;

      this.debouncedFunc();
      this.debouncedFunc();
      this.debouncedFunc();
      setTimeout( 200, function () {
        _this.debouncedFunc();
        _this.debouncedFunc();
        _this.debouncedFunc();
      });
      setTimeout( 300, function () {
        expect( _this.func.calls.count() ).toEqual( 2 );
      })
    });
  });

  describe( '#escapedRegex', function () {
    it( 'should a regex for the given text, with all special chars escaped', function () {
      var text = "This is-/(the)\\ story of a ^$*girl +?.|[]{}";
      var expectedResult = /This is\-\/\(the\)\\ story of a \^\$\*girl \+\?\.\|\[\]\{\}/;
      expect( this.helper.escapedRegex(text) ).toEqual( expectedResult );
    });
  });

  describe( '#filter', function () {

    beforeEach( function () {
      this.list = [{name: 'Hagrid'}, {name: 'Harry'}, {name: 'Minerva'}, {}];
      this.results = this.helper.filter( this.list, function ( item ) {
        return item.name && !!item.name[0].match( /[hH]/ );
      });
    });

    it( 'should return only the expected objects', function () {
      expect( this.results ).toEqual( this.list.slice(0, 2) );
    });
  });

  describe( '#find', function () {
    beforeEach( function () {
      this.list = [{name: 'Minerva'}, {name: 'Hagrid'}, {name: 'Harry'}, {}];
      this.result = this.helper.find( this.list, function ( item ) {
        return item.name && !!item.name[0].match( /[hH]/ );
      });
    });

    it( 'should return the first matched object', function () {
      expect( this.result ).toEqual( this.list[1] );
    });
  });

  describe( '#includes', function () {

    describe( 'when the list includes the candidate', function () {
      var list = [1,2,3];

      it( 'should return true', function () {
        expect( this.helper.includes(list, 2) ).toEqual( true );
      });
    });

    describe( 'then the list does not include the candidate', function () {
      var list = [1,2,3];

      it( 'should return true', function () {
        expect( this.helper.includes(list, 4) ).toEqual( false );
      });
    });
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

  describe( '#merge', function () {

    describe( 'when no overrides are given', function () {
      var defaults = {test: 'this', out: 1};
      var overrides = {};

      it( 'should return the defaults', function () {
        expect( this.helper.merge(defaults, overrides) ).toEqual( defaults );
      })
    });

    describe( 'when some overrides are given', function () {
      var defaults = {test: 'this', out: 1};
      var overrides = {test: 'that', now: true};
      var expectedResult = {test: 'that', out: 1, now: true};

      it( 'should return an object with all keys from overrides, plus missing data from defaults', function () {
        expect( this.helper.merge(defaults, overrides) ).toEqual( expectedResult );
      })
    });

    describe( 'when all defaults are to be overwritten', function () {
      var defaults = {test: 'this', out: 1};
      var overrides = {test: 'that', out: 2, now: true};

      it( 'should return a copy of overrides', function () {
        expect( this.helper.merge(defaults, overrides) ).toEqual( overrides );
      })
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
    var text = "Harry Potter and the Sorcerer's Stone\vBy JK Rowling\fChapter 2.4:\nThe Boy Who Lived\r\"1 day, long ago?\"    Another test! $5 we go. (Well well well) this is interesting.";
    var expectedResult = [
      "Harry Potter and the Sorcerer's Stone\v",
      "By JK Rowling\f",
      "Chapter 2.4:\n",
      "The Boy Who Lived\r",
      "\"1 day, long ago?\"    ",
      "Another test! ",
      "$5 we go. ",
      "(Well well well) this is interesting."
    ]

    it( 'should split up the text as expected', function () {
      expect( this.helper.separateSentences(text) ).toEqual( expectedResult );
    });
  });

  describe( '#uniqueId', function () {
    beforeEach( function () {
      this.idCount = parseInt( this.helper.uniqueId() );
    });

    describe( 'when given a prefix', function () {
      it( 'should return the iterator appended to the given prefix', function () {
        expect( this.helper.uniqueId('prefix') ).toEqual( 'prefix' + ++this.idCount );
      });
    });

    describe( 'when NOT given a prefix', function () {
      it( 'should return the iterator as a string', function () {
        expect( this.helper.uniqueId() ).toEqual( '' + ++this.idCount );
      });

      it( 'should not return an already used iterator', function () {
        this.helper.uniqueId();
        this.helper.uniqueId();
        this.helper.uniqueId();

        expect( this.helper.uniqueId() ).toEqual( '' + (this.idCount + 4) );
      });
    });
  });
});





































