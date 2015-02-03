crayon.helpers || ( crayon.helpers = {} )
crayon.helpers.routes = {};

( function ( namespace ) {

  var _urlRoot;

  // api

  namespace.api_page_annotations_url = function ( url ) {
    return urlRoot() + '/api/annotations/by_page?' +
      crayon.helpers.url.toQueryStr({ url: url });
  };

  // application routes

  namespace.annotation_url = function ( id ) {
    return urlRoot() + '/annotations/' + id;
  };

  // TODO: update to use heroku HTTPS
  var urlRoot = function () {
    if ( _urlRoot == null ) {
      if ( crayon.env === 'production' ) {
        _urlRoot = 'http://scribble.ly';
      } else if ( crayon.env === 'development' ) {
        _urlRoot = 'http://scribble.dev:3000';
      } else {
        // for testing
        _urlRoot = 'http://scribble.test';
      }
    }

    return _urlRoot;
  };
})( crayon.helpers.routes );
