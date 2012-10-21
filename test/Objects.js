var _  = require("underscore"),
script = require("factor_script"),
assert = require("assert");

var h    = require("factor_script/lib/test/default"),
new_code = h.new_code,
vars     = h.vars;

describe("Objects: +[ ]+", function () {

  describe( 'syntax', function () {

    it("allows keys", function () {

      var str = '  \
        "My_Obj" is: +[              \
          "name" is: "LIST" ,     \
          "city" is: "Hong Kong"  \
        ]+ \
      ';

      assert.deepEqual(vars(str).My_Obj.Vars, {
        name: "LIST",
        city: "Hong Kong",
      });
    });

    it('sets read env to outside', function () {

      var str = ' \
        "Uno" is: "uno" \
        "One" is: "one" \
        "My_Obj" is: +[     \
          "name" is: Uno \
          "nick" is: One \
        ]+ \
      ';

      assert.deepEqual(vars(str).My_Obj.Vars, {
        name: "uno",
        nick: "one"
      });

    });

  }); // === describe

}); // === describe

describe( 'Objects', function () {
}); // === describe

