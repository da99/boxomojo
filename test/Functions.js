

var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("factor_script/lib/test/default"),
    Parse   = require('factor_script/lib/Parse');

var new_code = h.new_code,
    returns  = h.returns,
    vars     = h.vars;

describe( 'Functions', function () {

  describe( 'run: ', function () {
    it( 'copys tokens of function', function () {
      var code = new_code(' "F" = { 1 2 3 } run F ');
      code.run();
      assert.deepEqual(code.Vars['F'].Tokens, [1,2,3]);
    });
    it( 'does not place anything on Returns stack if function has an empty Returns stack (ie prevent undefined)', function () {
      var str = ' run {  } ';
      assert.deepEqual( returns(str), [ ] );
    });

    it( 'returns last value', function () {
      var str = ' run { 1 + 1 + 1 } ';
      assert.deepEqual( returns(str), [3] );
    });

    it( 'saves vars to Outside box', function () {
      var str = ' run { "One" = "Neo" } ';
      assert.deepEqual( vars(str).One, "Neo" );
    });
  }); // === describe

}); // === describe
