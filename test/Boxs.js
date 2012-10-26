var _  = require("underscore"),
script = require("factor_script"),
assert = require("assert");

var h    = require("factor_script/lib/test/default"),
new_code = h.new_code,
vars     = h.vars;

describe("Boxs: x[ ]x", function () {

  describe( 'syntax', function () {

    it("allows keys", function () {

      var str = ' "My_Obj" = x[ "name" = "LIST" , "city" = "Hong Kong" ]x ';

      assert.deepEqual(vars(str).My_Obj.Vars, {
        name: "LIST",
        city: "Hong Kong",
      });
    });

    it('sets read env to outside', function () {

      var str = ' \
        "Uno" = "uno" , "One" = "one" \
        "My_Obj" = x[ "name" = Uno , "nick" = One ]x ';

      assert.deepEqual(vars(str).My_Obj.Vars, {
        name: "uno",
        nick: "one"
      });

    });

  }); // === describe

  describe( 'modules', function () {
    it( 'adds base module', function () {
      var code = new_code(' x[ ]x ');
      code.run();
      assert.equal(code.Returns[0].Modules.length, 1);
    });

    it( 'does not add module if it does not exist', function () {
      var box = script.Box("", null);
      assert.equal(box.Modules.length, 1);
    });
  }); // === describe

  describe( '=o', function () {
    it( 'adds name to "[ox]"', function () {
      var code = new_code(' x[ "One" =o 1 ]x ');
      code.run();
      assert.equal(code.Returns[0]['[ox]'], "One");
    });
  }); // === describe

  describe( '<ox', function () {

    it( 'adds name to "[ox]"', function () {
      var code = new_code(' "O" = x[ ]x <ox "One" 1');
      code.run();
      assert.deepEqual(code.Vars['O']['[ox]'], ["One"]);
    });

    it( 'adds var "', function () {
      var code = new_code(' "V" = x[ ]x <ox "One" 1');
      code.run();
      assert.deepEqual(code.Vars['V']['[ox]'], ['One']);
    });

  }); // === describe

}); // === describe


