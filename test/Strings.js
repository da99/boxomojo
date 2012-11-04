
var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("boxomojo/lib/test/default"),
    Parse   = require('boxomojo/lib/Parse');

var new_code = h.new_code,
    returns  = h.returns;

describe( 'Strings', function () {

  describe( '+', function () {

    it( 'adds strings', function () {
      assert.equal( _.last(returns(' "a" + "b" ')), 'ab');
    });

  }); // === describe

  describe( '*', function () {

    it( 'multiplies strings', function () {
      assert.equal( _.last(returns(' "a" * 3 ')), ('aaa'));
    });

  }); // === describe

}); // === describe

