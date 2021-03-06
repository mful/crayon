crayon.helpers || ( crayon.helpers = {} )
crayon.helpers.xhr = {};

( function ( namespace ) {
  var _csrfHeaders;

  namespace.request = function (type, url, opts, callback) {
    var xhr = new XMLHttpRequest(),
        pd;

    xhr.withCredentials = true;

    if (typeof opts === 'function') {
      callback = opts;
      opts = null;
    }

    xhr.open(type, url);

    if (type === 'POST' && opts) {
      pd = JSON.stringify(opts);
      xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.onload = function () {
      var res = {data: JSON.parse(xhr.response), status: xhr.status};
      return callback.call(xhr, null, res);
    };

    xhr.onerror = function () {
      return callback.call(xhr, true);
    };

    xhr.send(opts ? pd : null);

    return xhr;
  };

  namespace.get = namespace.request.bind(this, 'GET');
  namespace.post = namespace.request.bind(this, 'POST');
})( crayon.helpers.xhr );
