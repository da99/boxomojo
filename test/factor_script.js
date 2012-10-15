
var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("factor_script/lib/test/default"),
    Parse   = require('factor_script/lib/Parse');

var new_code = h.new_code;

describe("New", function () {

  it("returns a script", function () {
    var s = new_code(' "One" is: 1 ');
    assert.equal(s.is_box(), true);
  });

  it("sets 'Code'", function () {
    var code = ' "One" is: 1 ';
    assert.equal(new_code(code).Code, code);
  });

  it( 'sets "Tokens"', function () {
    var code = ' "Hoppe" is: "right" ';
    assert.deepEqual(new_code(code).Tokens, h.to_tokens(code));
  });

}); // === describe

describe( '.run()', function () {

  it( 'returns last value', function () {
    assert.deepEqual(new_code(" 5 + 1 ").run(), 6);
  });

  it( 'raises error if word not found', function () {
    var word = 'not-found-xyz', err  = null;

    try {
      new_code(" " + word + " ").run();
    } catch (e) {
      var err = e;
    };

    assert.deepEqual(err.message, "run: function not found: " + word);
  });

}); // === describe

describe( 'Base variables create', function () {

  it('saves variable to Returns stack',  function () {

    var s = new_code(' "One" is: 1 ');
    s.run();
    assert.deepEqual(s.Returns, [ 1 ]);
  });

  it( 'saves variables to Vars',  function () {

    var s = new_code(' "One" is: 1 ');
    s.run();
    assert.deepEqual(s.Vars, { 'One': 1 } );

  });

}); // === describe


describe('.Returns', function () {

  it( 'gathers numbers',  function () {
    var s = new_code(' 1 2 3 ');
    s.run();
    assert.deepEqual(s.Returns, [ 1, 2, 3 ]);
  });

  it( 'gathers quoted strings',  function () {
    var s = new_code(' "a"  "long string" "c" ');
    s.run();
    assert.deepEqual(s.Returns, [ 'a', 'long string', 'c' ]);
  });

}); // === describe



