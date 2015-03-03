describe( 'crayon.services.AnnotationInjector', function () {

  var params = { cryn_type: 'reply' },
      parser;

  describe( '#handleParams', function () {

    describe( 'when given a reply', function () {

      beforeEach( function () {
        crayon.dispatcher = {dispatch: function () {}};

        spyOn( crayon.helpers.url, 'queryObject' ).and.returnValue( params );
        spyOn( crayon.dispatcher, 'dispatch' );


        this.parser = new crayon.services.QueryParamParser();
        this.parser.handleParams();
      });

      it( 'should dispatch a reply notification', function () {
        expect( crayon.dispatcher.dispatch ).toHaveBeenCalledWith({
          message: 'reply_notification',
          data: params
        });
      })
    });

    describe( 'when given an unrecognized type', function () {

      beforeEach( function () {
        crayon.dispatcher = {dispatch: function () {}};

        spyOn( crayon.helpers.url, 'queryObject' ).and.returnValue({ cryn_type: 'test' });
        spyOn( crayon.dispatcher, 'dispatch' );

        this.parser = new crayon.services.QueryParamParser();
      });

      it( 'should dispatch a reply notification', function () {
        expect( this.parser.handleParams() ).toEqual( false );
      })
    });

    describe( 'when not given a cryn_type', function () {

      beforeEach( function () {
        crayon.dispatcher = {dispatch: function () {}};

        spyOn( crayon.helpers.url, 'queryObject' ).and.returnValue( {} );
        spyOn( crayon.dispatcher, 'dispatch' );

        this.parser = new crayon.services.QueryParamParser();
      });

      it( 'should dispatch a reply notification', function () {
        expect( this.parser.handleParams() ).toEqual( false );
      })
    });
  });
});
