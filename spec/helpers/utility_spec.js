describe( 'crayon.helpers.utility', function () {

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
        crayon.helpers.utility.addClass( this.element, 'out' )
      });

      it( 'should change nothing', function () {
        expect( this.element.className ).toEqual( this.originalClassName );
      })
    })

    describe( 'when the class does not already exist', function () {
      beforeEach( function () {
        crayon.helpers.utility.addClass( this.element, 'magic-class' )
      });

      it( 'should add the new class', function () {
        expect( this.element.className ).toEqual( this.originalClassName + ' magic-class' );
      });
    })
  });

  describe( '#isBlank', function () {

    describe( 'when the given string is null', function () {
      it( 'should return true', function () {
        expect( crayon.helpers.utility.isBlank( null ) ).toEqual( true );
      });
    });

    describe( 'when the given string is whitespace', function () {
      it( 'should return true', function () {
        expect( crayon.helpers.utility.isBlank( '    ' ) ).toEqual( true );
      });
    });

    describe( 'when the given string is valid', function () {
      it( 'should return false', function () {
        expect( crayon.helpers.utility.isBlank( 'A string!' ) ).toEqual( false );
      });
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
        crayon.helpers.utility.removeClass( this.element, 'magic-class' );
      });

      it( 'should not change the className of the element', function () {
        expect( this.element.className ).toEqual( this.originalClassName );
      });
    });

    describe( 'when the class is applied to the element', function () {
      it( 'should remove the class when it is the first class', function () {
        crayon.helpers.utility.removeClass( this.element, 'test-me' );
        expect( this.element.className ).toEqual(' out now-pls');
      });

      it( 'should remove the class when it is the last class', function () {
        crayon.helpers.utility.removeClass( this.element, 'now-pls' );
        expect( this.element.className ).toEqual('test-me out');
      });

      it( 'should remove the class when it is a class in the middle of the className', function () {
        crayon.helpers.utility.removeClass( this.element, 'out' );
        expect( this.element.className ).toEqual('test-me now-pls');
      });
    });
  })
});
