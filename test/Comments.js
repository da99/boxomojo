

var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("factor_script/lib/test/default"),
    Parse   = require('factor_script/lib/Parse');

var new_code = h.new_code,
    returns  = h.returns,
    vars     = h.vars;

describe( 'Comments', function () {

  describe( 'Multi-line', function () {

    it( 'gets ignored', function () {
      var str = '           \
        #!!!                \
        This gets ignored.  \
        !!!                 \
        "One" is: 1         \
      ';
      assert.deepEqual( returns(str), [1] );
    });

    it( 'allowed in strings', function () {
      var target = " #!!!\nThis gets ignored.\n!!! ";
      var str = '"' + target + '"';
      assert.deepEqual(returns(str), [target]);
    });

  }); // === describe

  describe( 'EOF comments', function () {
    it( 'gets ignored', function () {
      var str = " #! This gets ignored. \n 5 "
      assert.deepEqual( returns(str), [5] );
    });

    it( 'allowed in strings', function () {
      var target = " #! This gets ignored. ";
      var str = '"' + target + '"';
      assert.deepEqual(returns(str), [target]);
    });
  }); // === describe

  describe( 'Single-line', function () {

    it( 'gets ignored', function () {
      var str = ' #!!! Ignored !!! "Two" is: 2 '
      assert.deepEqual( returns(str), [2] );
    });

    it( 'allowed in strings', function () {
      var target = " #!!! This gets ignored. !!! ";
      var str = '"' + target + '"';
      assert.deepEqual(returns(str), [target]);
    });

  }); // === describe

}); // === describe
