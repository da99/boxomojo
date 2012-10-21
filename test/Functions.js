

var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("factor_script/lib/test/default"),
    Parse   = require('factor_script/lib/Parse');

var new_code = h.new_code,
    returns  = h.returns,
    vars     = h.vars;

describe( 'Functions', function () {

  it( 'returns last value', function () {
    var str = ' run { 1 + 1 + 1 } ';
    assert.deepEqual( returns(str), [3] );
  });

  it( 'saves vars to Outside box', function () {
    var str = ' run { "One" = "Neo" } ';
    assert.deepEqual( vars(str).One, "Neo" );
  });
}); // === describe
