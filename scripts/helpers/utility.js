crayon.helpers || ( crayon.helpers = {} )

crayon.helpers.utility = {
  isBlank: function ( string ) {
    return !string || /^\s*$/.test( string );
  }
};
