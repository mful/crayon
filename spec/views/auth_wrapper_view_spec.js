describe( 'crayon.views.AuthWrapperView', function () {

  beforeEach( function () {
    this.view = new crayon.views.AuthWrapperView();
  });

  afterEach( function () {
    if( document.body.querySelector( '#' + this.view.element.id ) )
      this.view.remove();
    delete this.view;
  });

  describe( '#render', function () {

    beforeEach( function () {
      this.view.render( 'vote' );
    });

    it( 'should set the iframe url to the signup path, with the expected param', function () {
      var url = 'http://scribble.test:31234/signup?referring_action=vote'
      expect( this.view.iframe.src ).toEqual( url );
    });

    it( 'should inject the view into the DOM', function () {
      expect( !!document.body.querySelector( '#' + this.view.element.id ) ).toEqual( true );
    });
  });

  describe( '#notifyRemove', function () {

    beforeEach( function () {
      crayon.dispatcher = {dispatch: function () {}};
      spyOn( crayon.dispatcher, 'dispatch' );
      this.view.notifyRemove();
    });

    it( 'should dispatch an event with the expected data', function () {
      expect( crayon.dispatcher.dispatch ).toHaveBeenCalledWith({
        message: crayon.constants.WindowConstants.REMOVE_WINDOW,
        data: {view: this.view}
      });
    });
  });
});
