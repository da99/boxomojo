
var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("boxomojo/test/helpers/default"),
    B       = require('boxomojo/lib/boxomojo').Boxomojo,
    Parser  = require('boxomojo/lib/Parser').Parser
;

describe("New", function () {

  it("returns a script", function () {
    var s = B.new(' "One" = 1 ');
    assert.equal(s.is_box, true);
  });

  it("sets 'Code'", function () {
    var code = ' "One" = 1 ';
    assert.equal(B.new(code).Code, code);
  });

  it( 'sets "Tokens"', function () {
    var code = ' "Hoppe" = "right" ';
    assert.deepEqual(B.new(code).Tokens, h.to_tokens(code));
  });

}); // === describe

describe( '.run()', function () {

  it( 'returns last value', function () {
    assert.deepEqual(B.new(" 5 + 1 ").run(), 6);
  });

  it( 'raises error if word not found', function () {
    var word = 'not-found-xyz', err  = null;

    try {
      B.new(" " + word + " ").run();
    } catch (e) {
      var err = e;
    };

    assert.deepEqual(err.message, "Function not found: " + word);
  });

}); // === describe

describe( 'Base variables create', function () {

  it('saves variable to Returns stack',  function () {

    var s = B.new(' "One" = 1 ');
    s.run();
    assert.deepEqual(s.Returns, [ 1 ]);
  });

  it( 'saves variables to Vars',  function () {

    var s = B.new(' "One" = 1 ');
    s.run();
    assert.deepEqual(s.Vars, { 'One': 1 } );

  });

}); // === describe


describe('.Returns', function () {

  it( 'gathers numbers',  function () {
    var s = B.new(' 1 2 3 ');
    s.run();
    assert.deepEqual(s.Returns, [ 1, 2, 3 ]);
  });

  it( 'gathers quoted strings',  function () {
    var s = B.new(' "a"  "long string" "c" ');
    s.run();
    assert.deepEqual(s.Returns, [ 'a', 'long string', 'c' ]);
  });

}); // === describe



