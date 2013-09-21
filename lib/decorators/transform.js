
exports.key = 'transform';
exports.order = 100;
exports.position = 'post';
exports.parse = function( x, fn ) {
  return fn( x );
};
