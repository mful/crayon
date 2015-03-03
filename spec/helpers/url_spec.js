describe( 'crayon.helpers.url', function () {

  describe( '#toQueryStr', function () {
    describe( 'when given null', function () {
      it( 'should return an empty string', function () {
        expect( crayon.helpers.url.toQueryStr( null ) ).toEqual( '' )
      });
    });

    describe( 'when given an empty object', function () {
      it( 'should return an empty string', function () {
        expect( crayon.helpers.url.toQueryStr( {} ) ).toEqual( '' )
      });
    });

    describe( 'when given an object with some properties', function () {
      it( 'should return the expected string, with everything url encoded', function () {
        var data = {test: 'this thang', out: 2}
        var expectedVal = 'test=this%20thang&out=2';

        expect( crayon.helpers.url.toQueryStr( data ) ).toEqual( expectedVal )
      });
    });
  });

  describe( '#queryObject', function () {

    var location = { search: '?cryn_type=reply&id=123&show=true' };

    beforeEach( function () {
      spyOn( crayon.helpers.url, 'currentLocation' ).and.returnValue( location );
    });

    it( 'should return the query params, as an object, properly handling various data types', function () {
      expect( crayon.helpers.url.queryObject() ).toEqual({
        cryn_type: 'reply',
        id: 123,
        show: true
      });
    });
  });
});
