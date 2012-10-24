
var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("factor_script/lib/test/default"),
    Parse   = require('factor_script/lib/Parse');

var new_code = h.new_code,
    returns  = h.returns;

describe( 'Core', function () {

  describe( '=', function () {

    it( 'raises error if name of variable is already a function name', function () {
      var box = new_code(' "One" = "yoyo" ');
      box.Functions['One'] = function (box) {
        return true;
      };

      var err = null;

      try {
        box.run();
      } catch (e) {
        var err = e;
      };

      assert.equal( err.message, "<+: Var already created: One" );
    });

  }); // === describe

  describe( '[<>]', function () {
    it( 'puts itself on the stack', function () {
      var box = new_code("[<>]");
      box.run();
      assert.equal( box, _.last(box.Returns) );
    });

    it( 'accepts functions in Core', function () {
      var box = new_code(' "One" = 1 [<>] get "One" ');
      box.run();
      assert.equal( _.last(box.Returns), 1 );
    });

    it( 'accepts functions if it\'s in the Functions list', function () {
      var box = new_code(' [<>] yoyo ');
      box.Functions['yoyo'] = function (box) {
        box.respond("hiya");
        return true;
      };
      box.run();
      assert.equal( _.last(box.Returns), 'hiya' );
    });
  }); // === describe

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

