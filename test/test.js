
var toList = require( 'object-to-list' );
var expect = require( 'expect.js' );

describe( 'object-to-list', function() {

  it( '#selector', function() {
    var n = { id: 1, position: { x: 0.0, y: 50.0, z: 10.0 } };
    var s1 = [
      { selector: 'id' },
      { selector: 'position.x' },
      { selector: 'position.y' },
      { selector: 'position.z' }
    ];
    var s2 = [ 'id', 'position.x', 'position.y', 'position.z' ];
    expect( toList( n, s1 ) ).to.eql( [ 1, 0.0, 50.0, 10.0 ] );
    expect( toList( n, s2 ) ).to.eql( [ 1, 0.0, 50.0, 10.0 ] );
  } );

  it( '#value', function() {
    var n = { id: 1, position: { x: 0.0, y: 50.0, z: 10.0 } };
    var s1 = [
      { value: 'node' },
      { selector: 'id', value: 'id' }
    ];
    expect( toList( n, s1 ) ).to.eql( [ 'node', 'id' ] );
  } );

  it( '#prefix', function() {
    var b = { type: 'BasicBuilder', ndm: 2, ndf: 2 };
    var s1 = [
      { value: 'model' },
      'type',
      { optional: true, selector: 'ndm', prefix: '-ndm' },
      { optional: true, selector: 'ndf', prefix: '-ndf' },
    ];

    var n1 = { id: 3, position:{ x: 168, y:  0 }, mass: { x: 0.2, y: 0.3, z: 0.4 } };
    var n2 = { id: 2, position:{ x: 168, y:  0 } };
    var s2 =[
      { value: 'node' },
      { selector: 'id' },
      { selector: 'position.x' },
      { selector: 'position.y' },
      { optional: true, selector: 'position.z' },
      { optional: true, selector: [ 'mass.x', 'mass.y', 'mass.z' ], prefix: '-mass' }
    ];

    expect( toList( b, s1 ) ).to.eql( [ 'model', 'BasicBuilder', [ '-ndm', 2 ], [ '-ndf', 2 ] ] );
    expect( toList( n1, s2 ) ).to.eql( [ 'node', 3, 168, 0, [ '-mass', 0.2, 0.3, 0.4 ] ] );
    expect( toList( n2, s2 ) ).to.eql( [ 'node', 2, 168, 0 ] );
  } );

  it( '#flag', function() {
    var n1 = { id: 1, print: true };
    var n2 = { id: 2 };
    var n3 = { id: 2, print: false };

    var s = [
      'id',
      { optional: true, selector: 'print', flag: '-print' }
    ];
    expect( toList( n1, s ) ).to.eql( [ 1, '-print' ] );
    expect( toList( n2, s ) ).to.eql( [ 2 ] );
    expect( toList( n3, s ) ).to.eql( [ 2 ] );
  } );

  it( '#transform', function() {
    var n1 = { id: 1, position: { x: 123.244, y: 630.366 } };
    var schema = [
      { value: 'node' },
      'id',
      { selector: [ 'position.x', 'position.y' ], transform: function( x ) { return Math.round( x ); } }
    ];
    expect( toList( n1, schema ) ).to.eql( [ 'node', 1, [ 123, 630 ] ] );
  } );

  it( '#convert', function() {
    var n1 = { id: 1, position: { x: 123.244, y: 630.366 } };
    var schema = [
      { value: 'node' },
      'id',
      {
        selector: [ 'position.x', 'position.y' ],
        transform: function( x ) { return Math.round( x ); },
        convert: function( list ) { return [ '{' ].concat( list ).concat( '}' ); }
      }
    ];
    expect( toList( n1, schema ) ).to.eql( [ 'node', 1, [ '{', 123, 630, '}' ] ] );
  } );

  it( '#validate', function() {
    var n1 = { id: 1, position: { x: 1, y: 2, z: 3 } };
    var n2 = { id: 1, position: { x: 1, y: 2, z: -3 } };
    var s = [
      { value: 'node' },
      'id',
      'position.x',
      'position.y',
      {
        selector: 'position.z', validate: function( x ) {
          if (x<0) {
            throw new Error( 'Should larger than 0' );
          }
          return x;
        }
      }
    ];


    var f1 = function() { return toList( n1, s ); };
    var f2 = function() { return toList( n2, s ); };

    expect( f1() ).to.eql( [ 'node', 1, 1, 2, 3 ] );

    expect( f2 ).to.throwError( function( e ) {
      expect( e.message ).to.be( 'Should larger than 0' );
    } );

  } );

  it( '#required/optional', function() {
    var n = { id: 1, position: { x: 1, y: 2 } };

    var s1 = [
      { value: 'node' },
      'id',
      'position.x',
      'position.y',
      'position.z'
    ];

    var s2 = [
      { value: 'node' },
      'id',
      'position.x',
      'position.y',
      { optional: true, selector: 'position.z' }
    ];

    var f1 = function() { return toList( n, s1 ); };
    var f2 = function() { return toList( n, s2 ); };

    expect( f1 ).to.throwError( function( e ) {
      expect( e.message ).to.be( 'Missing required field position.z' );
    } );

    expect( f2() ).to.eql( [ 'node', 1, 1, 2 ] );
  } );

  it( '#type', function() {
    var n1 = { id: 1, name: 'n', flag: true, position: { x: 1, y: 2 } };
    var n2 = { id: 1, name: 'n', flag: 'true', position: { x: 1, y: 2 } };
    var n3 = { id: 1, name: 123, flag: true, position: { x: 1, y: 2 } };
    var n4 = { id: 1, name: 'n', flag: true, position: { x: '1', y: 2 } };

    var s = [
      { value: 'node' },
      { selector: 'id', type: 'number' },
      { selector: 'name', type: 'string' },
      { selector: 'flag', type: 'boolean' },
      { selector: 'position.x', type: 'number' },
      { selector: 'position.y', type: 'number' }
    ];

    var f1 = function() { return toList( n1, s ); };
    var f2 = function() { return toList( n2, s ); };
    var f3 = function() { return toList( n3, s ); };
    var f4 = function() { return toList( n4, s ); };

    expect( f1() ).to.eql( [ 'node', 1, 'n', true, 1, 2 ] );

    expect( f2 ).to.throwError( function( e ) {
      expect( e.message ).to.be( 'Value of obj.flag true is not a boolean' );
    } );

    expect( f3 ).to.throwError( function( e ) {
      expect( e.message ).to.be( 'Value of obj.name 123 is not a string' );
    } );

    expect( f4 ).to.throwError( function( e ) {
      expect( e.message ).to.be( 'Value of obj.position.x 1 is not a number' );
    } );
  } );



} );
