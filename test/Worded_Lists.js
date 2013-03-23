var _  = require("underscore"),
assert = require("assert");

var h    = require("boxomojo/test/helpers/default"),
new_code = h.new_code,
vars     = h.vars;

describe("Worded lists: w[ ]w", function () {

  describe( 'syntax', function () {

    it("allows keys", function () {

      var str = ' "My_Obj" = w[  "name" = "LIST" , "city" = "Hong Kong" ]w ';
      assert.deepEqual(vars(str).My_Obj.Vars, {
        name: "LIST",
        city: "Hong Kong",
      });
    });

    it('sets read env to outside', function () {

      var str = '\
        "Uno" = "uno" , "One" = "one" \
        "My_Obj" = w[ "name" = Uno , "nick" = One ]w ';

      assert.deepEqual(vars(str).My_Obj.Vars, {
        name: "uno",
        nick: "one"
      });

    });

  }); // === describe

}); // === describe


