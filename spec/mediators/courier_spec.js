describe( 'crayon.mediators.Courier', function () {

  beforeEach( function () {
    this.mediator = new crayon.mediators.Courier()
  });

  afterEach( function () {
    delete this.mediator;
  });

  describe( '#post', function () {

    beforeEach( function () {
      var message = 'login_success',
          data = {currentUser: {username: 'hagrid'}};

      this.contentWindow = {postMessage: function () {}};
      spyOn( this.contentWindow, 'postMessage' );

      this.mediator.post( this.contentWindow, message, data );
    });

    it( 'should post a message, with the expected data, to the given window object', function () {
      expect( this.contentWindow.postMessage ).toHaveBeenCalledWith(
        JSON.stringify({ message: 'login_success', data: {currentUser: {username: 'hagrid'}} }),
        '*'
      );
    });
  });

  describe( '#receivePackage', function () {

    beforeEach( function () {
      crayon.dispatcher = {dispatch: function () {}};
      spyOn( crayon.dispatcher, 'dispatch' );
    });

    afterEach( function () {
      delete crayon.dispatcher;
    });

    describe( 'when coming from a non-scribble window', function () {

      beforeEach( function () {
        var event = {
          origin: 'http://facebook.com',
          data: JSON.stringify({ message: 'login_success', data: {currentUser: {username: 'hagrid'}} })
        }

        this.mediator.receivePackage( event );
      });

      it( 'should do nothing', function () {
        expect( crayon.dispatcher.dispatch ).not.toHaveBeenCalled();
      });
    });

    describe( 'when given invalid data', function () {

      beforeEach( function () {
        var event = {
          origin: 'http://scribble.test',
          data: "!_{h:''}"
        }

        this.mediator.receivePackage( event );
      });

      it( 'should do nothing', function () {
        expect( crayon.dispatcher.dispatch ).not.toHaveBeenCalled();
      });
    });

    describe( 'when coming from a scribble window, with valid data', function () {

      beforeEach( function () {
        this.data = { message: 'login_success', data: {currentUser: {username: 'hagrid'}} };

        var event = {
          origin: 'http://scribble.test',
          data: JSON.stringify( this.data )
        }

        this.mediator.receivePackage( event );
      });

      afterEach( function () {
        delete this.data;
      });

      it( 'should dispatch the message and data', function () {
        expect( crayon.dispatcher.dispatch ).toHaveBeenCalledWith( this.data );
      });
    });
  });

});
