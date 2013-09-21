
exports.key = 'validate';
exports.order = 100;
exports.position = 'pre';
exports.parse = function( x, fn ) {
  return fn( x );
};
