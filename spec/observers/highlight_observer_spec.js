describe( 'crayon.observers.HighlightObserver', function () {

  beforeEach( function () {
    this.observer = new crayon.observers.HighlightObserver();
    crayon.vent = ev(document.createElement('div'));
  });

  afterEach( function () {
    delete this.observer;
    delete crayon.vent;
  });

  describe( '#highlight', function () {

  });

  describe( '#getSelection', function () {

    beforeEach( function() {
      this.selection = {
        rangeCount: 2,
        getRangeAt: function () {}
      };
      spyOn( window, 'getSelection' ).and.returnValue( this.selection );
    });

    it( 'should return the selection, with multiple ranges', function () {
      expect( this.observer.getSelection() ).toEqual( this.selection );
    });

    it( 'should return null when there is no selection', function () {
      this.selection.rangeCount = 0;
      expect( this.observer.getSelection() ).toEqual( null );
    });

    describe( 'with a single range', function () {

      beforeEach( function () {
        this.range = {cloneContents: function(){}};
        this.selection.rangeCount = 1;
        spyOn( this.selection, 'getRangeAt' ).and.returnValue( this.range );
      });

      it( 'should return null when the selection is collapsed', function () {
        this.selection.isCollapsed = true;
        expect( this.observer.getSelection() );
      });

      it( 'should return the selection with a non-blank selection', function () {
        spyOn( this.range, 'cloneContents' ).and.returnValue({ textContent: 'test' });
        expect( this.observer.getSelection() ).toEqual( this.selection );
      });

      it( 'should return null with a blank selection', function() {
        spyOn( this.range, 'cloneContents' ).and.returnValue({ textContent: '   ' });
        expect( this.observer.getSelection() ).toEqual( null );
      });
    });

  });
});
