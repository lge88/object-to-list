
exports.key = 'prefix';
exports.order = 1;
exports.position = 'post';
exports.parse = function( x, prefix ) {
  if ( !Array.isArray( x ) ) { x = [x]; }
  if ( !Array.isArray( prefix ) ) { prefix = [prefix]; }
  return prefix.concat( x );
};
