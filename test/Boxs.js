var _  = require("underscore"),
script = require("boxomojo"),
assert = require("assert");

var h    = require("boxomojo/test/helpers/default"),
new_code = h.new_code,
vars     = h.vars;

describe("Boxs: { }", function () {

  describe( 'syntax', function () {

    it("allows keys", function () {

      var str = ' "My_Obj" = {  "name" = "LIST" , "city" = "Hong Kong" } ';

      assert.deepEqual(vars(str).My_Obj.Vars, {
        name: "LIST",
        city: "Hong Kong",
      });
    });

    it('sets read env to outside', function () {

      var str = ' \
        "Uno" = "uno" , "One" = "one" \
        "My_Obj" = { "name" = Uno , "nick" = One } ';

      assert.deepEqual(vars(str).My_Obj.Vars, {
        name: "uno",
        nick: "one"
      });

    });

  }); // === describe

}); // === describe


