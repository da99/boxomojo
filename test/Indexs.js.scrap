
var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("factor_script/lib/test/default"),
    Parse   = require('factor_script/lib/Parse');

var new_code = h.new_code,
    returns  = h.returns,
    vars     = h.vars;

describe( 'Indexs: u[ ]u', function () {

    it("allows keys", function () {

      var str = '  \
        "Var" = u[              \
          "name" = "LIST" ,     \
          "city" = "Hong Kong"  \
        ]u \
      ';

      assert.deepEqual(vars(str).Var.Vars, {
        name: "LIST",
        city: "Hong Kong",
      });
    });

  it('sets read env to outside', function () {
    var str = ' \
      "Uno" = "uno"  \
      "One" = "one"  \
      "Var" = u[    \
        "name" = Uno \
        "nick" = One \
      ]u \
    ';

    assert.deepEqual(vars(str).Var.Vars, { name: 'uno', nick: 'one' } );
  });
}); // === describe
