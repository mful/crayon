describe( 'crayon.models.Annotation', function () {

  beforeEach( function () {
    this.selection = {
      rangeCount: 1,
      getRangeAt: function ( i ){
        return {
          cloneContents: function () {
            return { textContent: ' We are not descended from fearful men.   ' };
          }
        }
      }
    };

    spyOn( crayon.helpers.url, 'currentHref' ).and.returnValue( 'https://hogwarts.com' );
    this.annotation = new crayon.models.Annotation( this.selection );
  });

  afterEach( function () {
    delete this.annotation;
  });

  describe('#parseText', function () {

    describe('with a single range', function(){
      it('should simply return the string', function(){
        expect( this.annotation.parseText( this.selection )).toEqual( 'We are not descended from fearful men.' );
      });
    });

    describe('with multiple ranges', function () {
      beforeEach( function () {
        this.selection = {
          rangeCount: 2,
          getRangeAt: function (i) {
            objs = [
              {
                cloneContents: function() {
                  return { textContent: 'We are not descended from fearful men.' }
                }
              },

              {
                cloneContents: function() {
                  return { textContent: 'Duh.' }
                }
              }
            ];
            return objs[i];
          }
        }
      });

      it( 'should piece together the contents with a space', function () {
        expect( this.annotation.parseText( this.selection )).toEqual( 'We are not descended from fearful men. Duh.' );
      });
    });

  });

  describe( '#toQueryStr', function() {
    it( 'should serialize the annotation and page url', function () {
      expect( this.annotation.toQueryStr() ).toEqual( 'text=We%20are%20not%20descended%20from%20fearful%20men.&url=https%3A%2F%2Fhogwarts.com' )
    })
  });

});
