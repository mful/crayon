crayon.helpers || ( crayon.helpers = {} )
crayon.helpers.routes = {};

( function ( namespace ) {

  var _urlRoot;

  namespace.origin = function () {
    return urlRoot();
  };

  // api

  namespace.api_page_annotations_url = function ( url ) {
    return urlRoot() + '/api/annotations/by_page?' +
      crayon.helpers.url.toQueryStr({ url: url });
  };

  // application routes

  namespace.annotation_url = function ( id ) {
    return urlRoot() + '/annotations/' + id;
  };

  namespace.comment_url = function ( id, params ) {
    params || ( params = {} );

    return urlRoot() + '/comments/' + id + '?' +
      crayon.helpers.url.toQueryStr( params );
  };

  namespace.new_annotation_comment_url = function ( id ) {
    return urlRoot() + '/annotations/' + id + '/comments/new'
  };

  // TODO: Add spec
  namespace.new_annotation_url = function ( params ) {
    params || ( params = {} );

    return urlRoot() + '/annotations/new?' +
      crayon.helpers.url.toQueryStr( params );
  };


  // TODO: Add spec
  namespace.new_reply_url = function ( id ) {
    return urlRoot() + '/comments/' + id + '/replies/new'
  };

  namespace.signup_url = function ( params ) {
    params || ( params = {} );
    return urlRoot() + '/signup?' + crayon.helpers.url.toQueryStr( params );
  };

  var urlRoot = function () {
    if ( _urlRoot == null ) {
      if ( crayon.env === 'production' ) {
        _urlRoot = 'http://scribble-prod.elasticbeanstalk.com/';
      } else if ( crayon.env === 'development' ) {
        _urlRoot = 'http://scribble.dev:3000';
      } else {
        // for testing
        _urlRoot = 'http://scribble.test:31234';
      }
    }

    return _urlRoot;
  };
})( crayon.helpers.routes );
