

var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("factor_script/lib/test/default"),
    Parse   = require('factor_script/lib/Parse');

var new_code = h.new_code,
    returns  = h.returns;

describe( 'Comments', function () {

  describe( 'Multi-line', function () {

    it( 'gets ignored', function () {
      var str = '           \
        ***                 \
        This gets ignored.  \
        ***                 \
        "One" is: 1         \
      ';
      assert.deepEqual( returns(str), [1] );
    });

  }); // === describe

  describe( 'Single-line', function () {
    it( 'gets ignored', function () {
      var str = ' *** Ignored *** "Two" is: 2 '
      assert.deepEqual( returns(str), [2] );
    });
  }); // === describe

}); // === describe
