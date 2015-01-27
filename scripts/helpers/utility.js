crayon.helpers || ( crayon.helpers = {} )

crayon.helpers.utility = {

  addClass: function ( element, cssClass ) {
    var regex = new RegExp( '(?:^|\\s)' + cssClass + '(?!\\S)' );

    if ( !!element.className.match( regex ) ) return;
    element.className = element.className + ' ' + cssClass;

    return element;
  },

  compact: function ( list ) {
    var results = [], i;

    for ( i = 0; i < list.length; i++ ) {
      if ( list[i] !== null && list[i] !== undefined )
        results.push( list[i] );
    }

    return results;
  },

  escapedRegex: function ( string ) {
    return new RegExp( crayon.helpers.utility.regexEscape(string) );
  },

  // NOTE: remove if underscore.js ends up added
  filter: function ( list, func ) {
    var results = [], i;

    for ( i = 0; i < list.length; i++ ) {
      if ( func(list[i]) ) results.push( list[i] );
    }

    return results;
  },

  // NOTE: remove if underscore.js ends up added
  find: function ( list, testerFunc ) {
    for ( var i = 0; i < list.length; i++ ) {
      if ( testerFunc(list[i]) ) return list[i];
    }
  },

  includes: function ( list, candidate ) {
    for ( var i = 0; i < list.length; i++ ) {
      if ( list[i] === candidate ) return true;
    }

    return false;
  },

  isBlank: function ( string ) {
    return !string || /^\s*$/.test( string );
  },

  isContained: function ( parent, child ) {
    var childRegex;
    childRegex = crayon.helpers.utility.escapedRegex( child.trim() );

    return !!parent.trim().match( childRegex );
  },

  regexEscape: function ( string ) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  },

  removeClass: function ( element, cssClass ) {
    var regex = new RegExp( '(?:^|\\s)' + cssClass + '(?!\\S)' );
    element.className = element.className.replace( regex, '' );

    return element;
  },

  separateSentences: function ( text ) {
    return text.replace(/(([.?!]['"”]?\s+)|((?![.?!])[\f\n\r\v]\s*))(?=[A-Z\d\$\('"“])/g, "$1>|<").split(">|<");
  }
};
