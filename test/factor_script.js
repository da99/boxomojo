
var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("factor_script/lib/test/default"),
    Parse   = require('factor_script/lib/Parse');

var new_code = h.new_code,
    num      = h.num,
    str      = h.str;

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

  it('saves variable to stack',  function () {

    var s = new_code(' "One" is: 1 ');
    s.run();
    assert.deepEqual(s.stack(), [ num('1') ]);
  });

  it( 'saves variables to w{}s',  function () {

    var s = new_code(' "One" is: 1 ');
    s.run();
    assert.deepEqual(s.stack('Local Vars'), { 'One': num('1')} );

  });

}); // === describe


describe('Stack', function () {

  it( 'adds numbers to stack',  function () {
    var s = new_code(' 1 2 3 ');
    s.run();
    assert.deepEqual(s.stack(), [ num('1'), num('2'), num('3') ]);
  });

  it( 'adds quoted strings to stack',  function () {
    var s = new_code(' "a"  "long string" "c" ');
    s.run();
    assert.deepEqual(s.stack(), [ str('a'), str('long string'), str('c') ]);
  });

}); // === describe



