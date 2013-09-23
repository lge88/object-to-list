
exports.key = 'convert';
exports.order = 200;
exports.position = 'post';
exports.convert = function( list, fn ) {
  return fn( list );
};
