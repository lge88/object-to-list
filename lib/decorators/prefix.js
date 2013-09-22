
exports.key = 'prefix';
exports.order = 1;
exports.position = 'post';
exports.convert = function( list, prefix ) {
  if ( list.length > 0 ) {
    return [prefix].concat( list );
  } else {
    return list;
  }
};
