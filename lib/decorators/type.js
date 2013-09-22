
exports.key = 'type';
exports.order = 2;
exports.position = 'pre';
exports.parse = function( x, arg, selector ) {
  var t = exports.types[arg];
  if ( t ) {
    x = t( x, selector );
  } else {
    throw new Error( 'Unknown type ' + arg );
  }
  return x;
}

var types = [ 'string', 'number', 'boolean' ];
types = types
  .map( function( t ) {
    var c = function( x, selector ) {
      if ( typeof x !== t ) {
        throw new Error( 'Value of obj.' + selector + ' '
                         + x + ' is not a ' + t );
      } else {
        return x;
      }
    };
    return [ t, c ];
  } )
  .reduce( function( prev, cur ) {
    prev[cur[0]] = cur[1];
    return prev;
  }, {} );

exports.types = types;
