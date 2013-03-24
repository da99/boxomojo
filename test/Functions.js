

var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("boxomojo/test/helpers/default"),
    Box     = require("boxomojo").Boxomojo,
    Parser  = require('boxomojo/lib/Parser').Parser;

var new_code = h.new_code,
    returns  = h.returns,
    vars     = h.vars;

describe( 'Functions', function () {

  describe( 'run: ', function () {

    it( 'places NONE on Returns stack if function has an empty Returns stack (ie prevent undefined)', function () {
      var str = ' run {  } ';
      assert.deepEqual( returns(str), [Box.NONE] );
    });

    it( 'returns last value', function () {
      var str = ' run { 1 + 1 + 1 } ';
      assert.deepEqual( returns(str), [3] );
    });

    it( 'does not save vars to Outside box', function () {
      var str = ' run { "One" = "Neo" } ';
      assert.deepEqual( _.isEmpty(vars(str)), true );
    });

  }); // === describe

}); // === describe
