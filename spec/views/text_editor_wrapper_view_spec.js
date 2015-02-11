describe( 'crayon.views.TextEditorWrapperView', function () {

  beforeEach( function () {
    this.view = new crayon.views.TextEditorWrapperView({
      commentableType: 'comment',
      commentableId: 1
    });
  });

  describe( '#iframeSrc', function () {
    describe( 'when the given type is a comment', function () {

      it( 'should reurn the url for a new comment on an annotation', function () {
        var expectedResult = crayon.helpers.routes.new_annotation_comment_url(1);
        expect( this.view.iframeSrc('comment', 1) ).toEqual( expectedResult );
      });
    });
  });
});
