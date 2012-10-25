var _  = require("underscore"),
script = require("factor_script"),
assert = require("assert");

var h    = require("factor_script/lib/test/default"),
new_code = h.new_code,
vars     = h.vars;

describe("Boxs: o[ ]o", function () {

  describe( 'syntax', function () {

    it("allows keys", function () {

      var str = ' "My_Obj" = o[ "name" = "LIST" , "city" = "Hong Kong" ]o ';

      assert.deepEqual(vars(str).My_Obj.Vars, {
        name: "LIST",
        city: "Hong Kong",
      });
    });

    it('sets read env to outside', function () {

      var str = ' \
        "Uno" = "uno" , "One" = "one" \
        "My_Obj" = o[ "name" = Uno , "nick" = One ]o ';

      assert.deepEqual(vars(str).My_Obj.Vars, {
        name: "uno",
        nick: "one"
      });

    });

  }); // === describe

  describe( 'modules', function () {
    it( 'adds base module', function () {
      var code = new_code(' o[ ]o ');
      code.run();
      assert.equal(code.Returns[0].Modules.length, 1);
    });

    it( 'does not add module if it does not exist', function () {
      var box = script.Box("", null);
      assert.equal(box.Modules.length, 1);
    });
  }); // === describe

}); // === describe


