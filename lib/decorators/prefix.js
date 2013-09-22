
exports.key = 'prefix';
exports.order = 1;
exports.position = 'post';
exports.convert = function( list, prefix ) {
  return [prefix].concat( list );
};
