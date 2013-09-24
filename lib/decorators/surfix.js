
exports.key = 'surfix';
exports.order = 2;
exports.position = 'post';
exports.convert = function( list, surfix ) {
  if ( list.length > 0 ) {
    return list.concat( [surfix] );
  } else {
    return list;
  }
};
