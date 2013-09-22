
module.exports = exports = parse;
var decorators = require( './decorators' )
  .reduce( function( prev, cur ) {
    if ( Array.isArray( cur ) ) {
      cur.forEach( function( c ) {
        prev[c.key] = c;
      } );
    } else {
      prev[cur.key] = cur;
    }
    return prev;
  }, {} );

function parse( obj, schema ) {

  if ( Array.isArray( schema ) ) {
    return schema
      .map( function( s ) { return parse( obj, s ); } )
      .filter( meaningful );
  }

  if ( typeof schema === 'string' ) { schema = { selector: schema }; }
  if ( schema.optional === true ) { schema.required = false; }

  schema = extend( { selector: null, required: true }, schema );

  // constant field
  if ( isValue( schema.value ) ) { return schema.value; }

  var selector = schema.selector;
  if ( !selector ) { return undefined; }

  // apply decorators:
  var val = ensureArray( selector )
    .map( function( s ) { return getValueFromSelector( obj, s ); } );

  var preStack = [ id ], postStack = [ id ];
  var key, decorator, f;

  for ( key in schema ) {
    if ( schema.hasOwnProperty( key ) ) {
      decorator = decorators[key];
      if ( decorator ) {
        if ( decorator.parse ) {
          f = function( parse, arg ) {
            return function( arr ) {
              return arr.map( function( x ) {
                return parse( x, arg, selector, arr, obj );
              } );
            }
          } ( decorator.parse, schema[key] );
        } else if ( decorator.convert ) {
          f = function( fn, arg ) {
            return function( arr ) {
              return fn( arr, arg, selector, obj );
            }
          } ( decorator.convert, schema[key] );
        }

        f.order = decorator.order || 1;
        f.key = key;

        if ( decorator.position === 'pre' ) {
          preStack.push( f );
        } else {
          postStack.push( f );
        }
      }
    }
  }

  // console.log( 'pre', preStack.map( function( f ) { return f.key; } ) );
  // console.log( 'post', postStack.map( function( f ) { return f.key; } ) );

  var pre = makeSeq( preStack.sort( byOrder ) );
  var post = makeSeq( postStack.sort( byOrder ) );

  val = pre( val );
  val = val.filter( meaningful );
  val = post( val );
  val = val.filter( meaningful );

  return unwrap( val );
};

function getValueFromSelector( obj, selector ) {
  var tmp = getTargetAndKey( obj, selector );
  if ( !tmp.target ) { return undefined; }
  return tmp.target[ tmp.key ];
}

function id( x ) { return x; }
id.order = 0;
id.key = 'id';

function byOrder( a, b ) { return b.order - a.order; };

function isValue( x ) {
  if ( typeof x === 'number' ) { return true; }
  if ( typeof x === 'string' ) { return true; }
  if ( typeof x === 'boolean' ) { return true; }
  return false;
}

function ensureArray( x ) {
  if ( !Array.isArray( x ) ) { x = [ x ]; }
  return x;
}

// [[[3.1415927]]] -> 3.1415927
function unwrap( x ) {
  while ( Array.isArray( x ) && x.length === 1 ) {
    x = x[0];
  }
  return x;
}

function meaningful( x ) {
  if ( typeof x === 'undefined' ) { return false; }
  if ( x === null ) { return false; }
  if ( Array.isArray( x ) && x.length === 0 ) { return false; }
  return true;
}

function extend( object ) {
  var args = Array.prototype.slice.call( arguments, 1 );
  for ( var i = 0, source; source = args[i]; ++i ) {
    if ( !source ) continue;
    for ( var property in source ) {
      object[ property ] = source[ property ];
    }
  }
  return object;
};

function getTargetAndKey( obj, selector, sep ) {
  sep || ( sep = '.' );
  var arr = selector.split( sep );
  var target = obj, key = arr.shift();
  while ( arr.length > 0 ) {
    target = target[ key ];
    key = arr.shift();
    if ( !target ) { return { target: target, key: key }; }
  }
  return { target: target, key: key };
}

function makeSeq( funcs ) {
  return funcs.reduce( function( sofar, f ) {
    return function( x ) { return f( sofar(x) ); };
  } );
}


module.exports = exports = parse;
