
// module.exports = exports = [
//   {
//     key: 'required',
//     order: 1,
//     position: 'pre',
//     parse: function( x, flag ) {
//       var errMsg = 'Missing required field';
//       if ( flag === true ) {
//         if ( x === null ) { throw new Error( errMsg );  }
//         if ( typeof x === 'undefined' ) { throw new Error( errMsg );  }
//       }
//       return x;
//     }
//   },
//   {
//     key: 'optional',
//     order: 1,
//     position: 'pre',
//     parse: function( x, flag ) {
//       var errMsg = 'Missing required field';
//       if ( !flag ) {
//         if ( x === null ) { throw new Error( errMsg );  }
//         if ( typeof x === 'undefined' ) { throw new Error( errMsg );  }
//       }
//       return x;
//     }
//   }
// ];

exports.key = 'required';
exports.order = 1;
exports.position = 'pre';
exports.parse = function( x, flag ) {
  var errMsg = 'Missing required field';
  if ( flag === true ) {
    if ( x === null ) { throw new Error( errMsg );  }
    if ( typeof x === 'undefined' ) { throw new Error( errMsg );  }
  }
  return x;
};
