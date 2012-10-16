
var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("factor_script/lib/test/default"),
    Parse   = require('factor_script/lib/Parse');

var new_code = h.new_code,
    returns  = h.returns,
    vars     = h.vars;


describe( 'Lists: [ ]', function () {

  describe( 'syntax', function () {

    it("keeps a list of numerical indexes", function() {
      var str = ' "Nums" is: [ 1 , 2 , 3 ] ';
      assert.deepEqual(vars(str).Nums.Returns, [ 1, 2, 3 ] )
    });

  }); // === describe

  describe( '+', function () {
    it( 'adds lists', function () {
      var v = _.last(returns(' [ 1 2 3 ] + [ 4 5 6 ] '));
      assert.deepEqual( v.Returns, [ 1,2,3,4,5,6 ] );
    });
  }); // === describe

}); // === describe
