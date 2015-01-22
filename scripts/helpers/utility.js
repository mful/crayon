crayon.helpers || ( crayon.helpers = {} )

crayon.helpers.utility = {

  addClass: function ( element, cssClass ) {
    var regex = new RegExp( '(?:^|\\s)' + cssClass + '(?!\\S)' );

    if ( !!element.className.match( regex ) ) return;
    element.className = element.className + ' ' + cssClass;

    return element;
  },

  // NOTE: remove if underscore.js ends up added
  find: function ( list, testerFunc ) {
    for ( var i = 0; i < list.length; i++ ) {
      if ( testerFunc(list[i]) ) return list[i];
    }
  },

  isBlank: function ( string ) {
    return !string || /^\s*$/.test( string );
  },

  isContained: function ( parent, child ) {
    var childRegex;
    childRegex = new RegExp( crayon.helpers.utility.regexEscape(child.trim()) );

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
    return text.replace(/(([.?!]\s+)|((?![.?!])[\f\n\r\v]\s*))(?=[A-Z\d\$\(])/g, "$1>|<").split(">|<");
  },
};
