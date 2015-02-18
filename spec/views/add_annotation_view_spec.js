describe( 'crayon.views.AddAnnotationView', function () {

  beforeEach( function () {
    spyOn( crayon.helpers.xhr, 'get' ).and.returnValue( true );
    crayon.init();

    this.selection = {
      rangeCount: 1,
      toString: function () {
        return 'not descended from fearful';
      },
      getRangeAt: function ( i ){
        return {
          commonAncestorContainer: { textContent: ' We are not descended from fearful men.   ' }
        }
      }
    }
    this.annotation = crayon.models.Annotation.createFromSelection( this.selection );
    this.view = new crayon.views.AddAnnotationView();
  });

  afterEach( function () {
    delete this.annotation;
    delete this.view;
    delete this.selection;
  });

  describe( '#render', function () {

    beforeEach( function (){
      spyOn( this.view, 'show' );
      this.view.render( this.annotation );
    });

    it( 'should append the template', function () {
      var element = document.body.querySelector( '#' + this.view.id )
      expect( element.id ).toEqual( this.view.id );
    });

    it( 'should show the template', function () {
      expect( this.view.show ).toHaveBeenCalled();
    });

    it( 'should not append the template multiple times, on multiple calls' , function () {
      this.view.render();
      this.view.render();
      expect( document.body.querySelectorAll( '#' + this.view.id ).length ).toEqual(1);
    });
  });

  describe( '#show', function () {
    beforeEach( function () {
      this.view.render( this.annotation );
      this.view.hide();
      this.view.show();
    });

    it( 'should remove the hidden class from the widget', function () {
      expect( !!this.view.element.className.match(/hidden/) ).toEqual( false );
    });
  });

  describe( '#hide', function () {
    beforeEach( function () {
      this.view.render( this.annotation );
      this.view.hide();
    });

    it( 'should add the hidden class to the widget', function () {
      expect( !!this.view.element.className.match(/hidden/) ).toEqual( true );
    });
  });
});
