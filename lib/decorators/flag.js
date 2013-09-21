
exports.key = 'flag';
exports.order = 4;
exports.position = 'post';
exports.parse = function( x, flag ) {
  if ( x ) {
    return flag;
  } else {
    return undefined;
  }
};
