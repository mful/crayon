crayon.helpers || ( crayon.helpers = {} )

crayon.helpers.utility = {

  addClass: function ( element, cssClass ) {
    var regex = new RegExp( '(?:^|\\s)' + cssClass + '(?!\\S)' );

    if ( !!element.className.match( regex ) ) return;
    element.className = element.className + ' ' + cssClass;

    return element;
  },

  isBlank: function ( string ) {
    return !string || /^\s*$/.test( string );
  },

  removeClass: function ( element, cssClass ) {
    var regex = new RegExp( '(?:^|\\s)' + cssClass + '(?!\\S)' );
    element.className = element.className.replace( regex, '' );

    return element;
  }
};
