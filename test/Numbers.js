
var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("boxomojo/lib/test/default"),
    Parse   = require('boxomojo/lib/Parse');

var new_code = h.new_code,
    returns  = h.returns;

describe( 'Numbers', function () {

  describe( '+', function () {

    it( 'adds numbers', function () {
      assert.equal( _.last(returns(' 1 + 2 + 3 ')), 6);
    });

  }); // === describe

  describe( '-', function () {

    it( 'subtracts numbers', function () {
      assert.equal( _.last(returns(' 1 - 2 - 3 ')), (1 - 2 - 3));
    });

  }); // === describe

  describe( '/', function () {

    it( 'divides numbers', function () {
      assert.equal( _.last(returns(' 1 / 2 / 3 ')), (1 / 2 / 3));
    });

  }); // === describe

  describe( '*', function () {

    it( 'multiplies numbers', function () {
      assert.equal( _.last(returns(' 1 * 2 * 3 ')), (1 * 2 * 3));
    });

  }); // === describe

  describe( '/.', function () {

    it( 'acts as a modulus', function () {
      assert.equal( _.last(returns(' 5 /. 3 ')), (5 % 3));
    });

  }); // === describe

}); // === describe

