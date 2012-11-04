

var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("boxomojo/lib/test/default"),
    Parse   = require('boxomojo/lib/Parse');

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
        1 + 1 + 1           \
      ';
      assert.deepEqual( returns(str), [3] );
    });

    it( 'does not get ignored in strings', function () {
      var target = " #!!!\nThis gets ignored.\n!!! ";
      var str = '"' + target + '"';
      assert.deepEqual(returns(str), [target]);
    });

    it( 'ignores valid boxomojo code in comments', function () {
      var str = '           \
        #!!!                \
        [ 1 ]               \
        !!!                 \
      ';
      assert.deepEqual( returns(str), [ ] );
    });

  }); // === describe

  describe( 'EOF comments', function () {
    it( 'gets ignored', function () {
      var str = " #! This gets ignored. \n 5 "
      assert.deepEqual( returns(str), [5] );
    });

    it( 'does not get ignored in strings', function () {
      var target = " #! This gets ignored. ";
      var str = '"' + target + '"';
      assert.deepEqual(returns(str), [target]);
    });

    it( 'ignores valid boxomojo code in comments', function () {
      var str = ' #! [ 1 ] ';
      assert.deepEqual( returns(str), [ ] );
    });

  }); // === describe

  describe( 'Single-line', function () {

    it( 'gets ignored', function () {
      var str = ' #!!! Ignored !!! 2 + 2 '
      assert.deepEqual( returns(str), [4] );
    });

    it( 'allowed in strings', function () {
      var target = " #!!! This gets ignored. !!! ";
      var str = '"' + target + '"';
      assert.deepEqual(returns(str), [target]);
    });

  }); // === describe

}); // === describe
