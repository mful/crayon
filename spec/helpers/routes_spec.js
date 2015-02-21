describe( 'crayon.helpers.routes', function () {
  beforeEach( function () {
    crayon.env = 'test';
    this.helper = crayon.helpers.routes;
  });

  afterEach( function () {
    delete this.helper;
  });

  describe( '#api_page_annotations_url', function () {
    var url = 'http://hogwarts.com/staff/transfiguration/mcgonagol';

    it( 'should return the expected url, with the expected params', function () {
      var expectedResult = 'http://scribble.test:31234/api/annotations/by_page?url=http%3A%2F%2Fhogwarts.com%2Fstaff%2Ftransfiguration%2Fmcgonagol';
      expect( this.helper.api_page_annotations_url(url) ).toEqual( expectedResult );
    });
  });

  describe( '#annotation_url', function () {
    it( 'should return the expected url for the annotation', function () {
      var expectedResult = 'http://scribble.test:31234/annotations/1';
      expect( this.helper.annotation_url(1) ).toEqual( expectedResult );
    });
  });

  describe( '#new_annotation_comment_url', function () {
    it( 'should return the expected url', function () {
      var expectedResult = 'http://scribble.test:31234/annotations/1/comments/new';
      expect( this.helper.new_annotation_comment_url(1) ).toEqual( expectedResult );
    });
  });

  describe( '#signup_url', function () {
    it( 'should return the exected url', function () {
      var expectedResult = 'http://scribble.test:31234/signup?referring_action=vote';
      expect( this.helper.signup_url({ referring_action: 'vote' }) ).toEqual( expectedResult );
    });
  });
});
