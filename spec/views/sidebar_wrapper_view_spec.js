describe( 'crayon.views.SidebarWrapperView', function () {

  beforeEach( function () {
    var sidebars = document.querySelectorAll( '.crayon-sidebar-wrapper-view' );
    sidebars = Array.prototype.slice.call( sidebars );
    for ( var i = 0; i < sidebars.length; i++ ) { sidebars[i].remove(); }

    this.view = new crayon.views.SidebarWrapperView();
    crayon.dispatcher = new crayon.dispatchers.Dispatcher();
    crayon.windowManager = new crayon.coordinators.WindowManager();
    crayon.annotatedTextManager = new crayon.coordinators.AnnotatedTextManager();
  });

  afterEach( function () {
    this.view.rendered = false;
    if ( this.view && document.body.contains(this.view.element) ) this.view.remove();
    delete crayon.dispatcher;
    delete crayon.windowManager;
    delete crayon.annotatedTextManager;
  });

  describe( '#render', function () {

    var url = 'http://scribble.test:31234/comments/1?cryn_type=reply&cryn_id=2&cryn_aid=1&cryn_cid=1';

    describe( 'when the view has not yet been rendered', function () {

      beforeEach( function () {
        spyOn( document.body, 'appendChild' ).and.callThrough();
        spyOn( this.view, 'delegateEvents' );

        this.view.render( url );
      });

      it( 'should append the element to the document body', function () {
        expect( document.body.appendChild ).toHaveBeenCalled();
      });

      it( 'should delegate events', function () {
        expect( this.view.delegateEvents ).toHaveBeenCalled();
      });

      it( 'should set the rendered flag to true', function () {
        expect( this.view.rendered ).toEqual( true );
      });

      it( 'should set the iframe url to the given url', function () {
        expect( this.view.element.querySelector( 'iframe' ).src ).toEqual( url );
      });
    });

    describe( 'when the view has been rendered before', function () {

      beforeEach( function () {
        this.view.render( 'http://google.dev' );

        spyOn( document.body, 'appendChild' ).and.callThrough();
        spyOn( this.view, 'delegateEvents' );

        this.view.render( url );
      });

      it( 'should NOT re-append the element to the document body', function () {
        expect( document.body.appendChild ).not.toHaveBeenCalled();
      });

      it( 'should NOT re-delegate events', function () {
        expect( this.view.delegateEvents ).not.toHaveBeenCalled();
      });

      it( 'should set the iframe url to the given url', function () {
        expect( this.view.element.querySelector( 'iframe' ).src ).toEqual( url );
      });
    });
  });

  describe( 'clicking to close', function () {

    beforeEach( function () {
      crayon.windowManager.windows.sidebar = this.view;
      this.view.render();
      this.view.element.querySelector( '.crayon-close-sidebar' ).click();
    });

    it ( 'should remove the sidebar from the DOM', function () {
      expect( document.body.querySelector( '#' + this.view.id ) ).toEqual( null );
    });
  });

});











































