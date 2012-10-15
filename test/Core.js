
var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("factor_script/lib/test/default"),
    Parse   = require('factor_script/lib/Parse');

var new_code = h.new_code,
    returns  = h.returns;

describe( 'Core', function () {

  describe( '+', function () {
    it( 'adds numbers', function () {
      assert.equal( _.last(returns(' 1 + 2 + 3 ')), 6);
    });

    it( 'adds lists', function () {
      var v = _.last(returns(' [ 1 2 3 ] + [ 4 5 6 ] '));
      assert.deepEqual( v.Returns, [ 1,2,3,4,5,6 ] );
    });
  }); // === describe

}); // === describe

