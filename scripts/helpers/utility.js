crayon.helpers || ( crayon.helpers = {} );
crayon.helpers.utility = {};

( function ( namespace ) {

  namespace.addClass = function ( element, cssClass ) {
    var regex = new RegExp( '(?:^|\\s)' + cssClass + '(?!\\S)' );

    if ( !!element.className.match( regex ) ) return;
    element.className = element.className + ' ' + cssClass;

    return element;
  };

  namespace.compact = function ( list ) {
    var results = [], i;

    for ( i = 0; i < list.length; i++ ) {
      if ( list[i] !== null && list[i] !== undefined )
        results.push( list[i] );
    }

    return results;
  };

  namespace.escapedRegex = function ( string ) {
    return new RegExp( namespace.regexEscape(string) );
  };

  // NOTE: remove if underscore.js ends up added
  namespace.filter = function ( list, func ) {
    var results = [], i;

    for ( i = 0; i < list.length; i++ ) {
      if ( func(list[i]) ) results.push( list[i] );
    }

    return results;
  };

  // NOTE: remove if underscore.js ends up added
  namespace.find = function ( list, testerFunc ) {
    for ( var i = 0; i < list.length; i++ ) {
      if ( testerFunc(list[i]) ) return list[i];
    }
  };

  namespace.includes = function ( list, candidate ) {
    for ( var i = 0; i < list.length; i++ ) {
      if ( list[i] === candidate ) return true;
    }

    return false;
  };

  namespace.isBlank = function ( string ) {
    return !string || /^\s*$/.test( string );
  };

  namespace.isContained = function ( parent, child ) {
    var childRegex;
    childRegex = crayon.helpers.utility.escapedRegex( child.trim() );

    return !!parent.trim().match( childRegex );
  };

  // NOTE: remove if underscore.js ends up added
  namespace.merge = function ( defaults, overrides ) {
    var merged = {},
        defaultsKeys = Object.keys( defaults ),
        overridesKeys = Object.keys( overrides ),
        keys, i;
    keys = defaultsKeys.concat( overridesKeys );

    for ( i = 0; i < keys.length; i++ ) {
      merged[keys[i]] = ( overrides[keys[i]] || defaults[keys[i]] );
    }

    return merged;
  };

  namespace.regexEscape = function ( string ) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  namespace.removeClass = function ( element, cssClass ) {
    var regex = new RegExp( '(?:^|\\s)' + cssClass + '(?!\\S)' );
    element.className = element.className.replace( regex, '' );

    return element;
  };

  namespace.separateSentences = function ( text ) {
    return text.replace(/(([.?!]['"”]?\s+)|((?![.?!])[\f\n\r\v]\s*))(?=[A-Z\d\$\('"“])/g, "$1>|<").split(">|<");
  };
})( crayon.helpers.utility );
