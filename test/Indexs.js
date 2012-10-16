
var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("factor_script/lib/test/default"),
    Parse   = require('factor_script/lib/Parse');

var new_code = h.new_code,
    returns  = h.returns,
    vars     = h.vars;

describe( 'Indexs: ~[ ]~', function () {

    it("allows keys", function () {

      var str = '  \
        "Var" is: ~[              \
          "name" is: "LIST" ,     \
          "city" is: "Hong Kong"  \
        ]~ \
      ';

      assert.deepEqual(vars(str).Var.Vars, {
        name: "LIST",
        city: "Hong Kong",
      });
    });

  it('sets read env to outside', function () {
    var str = ' \
      "Uno" is: "uno"  \
      "One" is: "one"  \
      "Var"  is: ~[    \
        "name" is: Uno \
        "nick" is: One \
      ]~ \
    ';

    assert.deepEqual(vars(str).Var.Vars, { name: 'uno', nick: 'one' } );
  });
}); // === describe
