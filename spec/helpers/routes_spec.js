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
      var expectedResult = 'http://scribble.test/api/annotations/by_page?url=http%3A%2F%2Fhogwarts.com%2Fstaff%2Ftransfiguration%2Fmcgonagol';
      expect( this.helper.api_page_annotations_url(url) ).toEqual( expectedResult );
    });
  });
});
