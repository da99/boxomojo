
var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("factor_script/lib/test/default"),
    Parse   = require('factor_script/lib/Parse');

var new_code = h.new_code,
    returns  = h.returns;

describe( 'Core', function () {

  describe( '<_', function () {
    it( 'adds a shortcut to previous item on the stack', function () {
      assert.deepEqual( returns(' 5 <_ "five" <_ '), [ 5, 5, "five", "five" ] );
    });

    it( 'throws an error if nothing on Returns stack', function () {
      var err = null;
      try {
        returns('<_');
      } catch (e) {
        err = e;
      };
      assert.equal(err.message, "<_: Returns stack can't be empty.");
    });
  }); // === describe

  describe( '_>', function () {
    it( 'adds a shortcut to next item on the stack', function () {
      assert.deepEqual( returns(' _> "hi" _> 5 '), [ 'hi', 'hi', 5, 5 ] );
    });

    it( 'throws an error if nothing on Tokens stack', function () {
      var err = null;
      try {
        returns('5 _>');
      } catch (e) {
        err = e;
      };
      assert.equal(err.message, "_>: Tokens stack can't be empty.");
    });
  }); // === describe

}); // === describe

