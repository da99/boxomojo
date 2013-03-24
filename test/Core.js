
var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("boxomojo/test/helpers/default"),
    Parser  = require('boxomojo/lib/Parser').Parser
;

var new_code = h.new_code,
    returns  = h.returns;

describe( 'Core', function () {

  describe( '[<>]', function () {
    it( 'puts itself on the stack', function () {
      var box = new_code("[<>]");
      box.run();
      assert.equal( box, box.read_back() );
    });

    it( 'accepts functions in Core', function () {
      var box = new_code(' "One" = 1 [<>] : "One" ');
      box.run();
      assert.equal( box.read_back(), 1 );
    });

  }); // === describe


}); // === describe

